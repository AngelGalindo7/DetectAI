import os
import uuid
import logging
import threading
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
# Allow only localhost:xxxx in dev; change in prod to your domain
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Configure logging
logging.basicConfig(level=logging.INFO)

# Use Cloud Run's mandated $PORT or fall back to 8080
PORT = int(os.getenv("PORT", 8080))

# Where to stage uploads
UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "/tmp/uploads")
# Ensure the upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Allowed extensions 
ALLOWED_EXT = set(os.getenv("ALLOWED_EXT", "mp3").split(","))


# In-memory storage for job progress (use Redis in production)
jobs = {}


    
def allowed_file(fn: str) -> bool:
    return "." in fn and fn.rsplit('.', 1)[1].lower() in ALLOWED_EXT


def process_audio_file(job_id, file_path):
    """
    Process audio file with progress updates.
    This simulates your model running with progress tracking.
    Replace with your actual model logic.
    """
    # Initialize job progress
    jobs[job_id] = {
        'progress': 0,
        'status': 'Starting analysis...',
        'complete': False,
        'result': None
    }
    
    try:
        # Simulate processing steps with progress updates
        steps = [
            ('Loading audio file...', 10),
            ('Extracting features...', 30),
            ('Applying AI detection model...', 60),
            ('Finalizing results...', 90),
            ('Complete', 100)
        ]
        
        for status, target_progress in steps:
            # Update job status
            jobs[job_id]['status'] = status
            app.logger.info(f"Job {job_id}: {status}")
            
            # Simulate processing time for this step
            start_progress = jobs[job_id]['progress']
            progress_to_add = target_progress - start_progress
            
            # Simulate step taking 1-3 seconds depending on the step
            step_duration = 1 + (progress_to_add / 50)
            increment_count = int(step_duration * 10)
            
            for i in range(increment_count):
                # Calculate smooth progress increment
                current_progress = start_progress + (progress_to_add * (i + 1) / increment_count)
                jobs[job_id]['progress'] = current_progress
                time.sleep(step_duration / increment_count)

        # Actually run your model and get results
        file_size = os.path.getsize(file_path)
        
        # Set the final result
        result = {
            "file_name": os.path.basename(file_path),
            "file_size_bytes": file_size,
            "prediction": "human" if file_size % 2 == 0 else "ai",  # Just a dummy logic
            "confidence": 0.85 + (file_size % 100) / 1000,  # Random confidence between 0.85-0.95
            "features": {
                "rhythm_score": 0.78,
                "dynamics_score": 0.92,
                "timbre_score": 0.81
            }
        }
        
        # Store the result for later retrieval
        jobs[job_id]['result'] = result
        jobs[job_id]['complete'] = True
        app.logger.info(f"Job {job_id} completed successfully")
        
        # Clean up the file after processing
        try:
            os.remove(file_path)
            app.logger.info(f"Removed temporary file {file_path}")
        except OSError:
            app.logger.warning(f"Could not remove {file_path}")
            
    except Exception as e:
        app.logger.exception(f"Error processing job {job_id}:")
        jobs[job_id]['status'] = f"Error during processing: {str(e)}"
        jobs[job_id]['progress'] = 0
        jobs[job_id]['complete'] = True
        jobs[job_id]['error'] = str(e)


@app.errorhandler(Exception)
def handle_exception(e):
    app.logger.exception("Server error:")
    return jsonify(error="Internal server error"), 500


@app.route("/healthz", methods=["GET"])
def healthz():
    return "OK", 200



@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    def handle_preflight():
        response = app.make_response('')
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response
    if request.method == "OPTIONS":
        return handle_preflight()

    if not request.files or "file" not in request.files:
        app.logger.warning(f"No file in request: {request.files}")
        return jsonify(error="No file part"), 400

        return response, 400

    f = request.files["file"]
    if f.filename == "":
        response = jsonify(error="No selected file")
        return response, 400
    if not allowed_file(f.filename):
        response = jsonify(error="Unsupported file type")
        return response, 400

    # Generate a unique job ID
    job_id = str(uuid.uuid4())
    
    # Secure and save filename
    unique_name = f"{job_id}_{secure_filename(f.filename)}"
    save_path = os.path.join(UPLOAD_FOLDER, unique_name)
    f.save(save_path)
    app.logger.info(f"Saved file to {save_path}")

    # Start processing in a background thread
    processing_thread = threading.Thread(
        target=process_audio_file,
        args=(job_id, save_path)
    )
    processing_thread.daemon = True
    processing_thread.start()
    
    # Return the job ID for progress tracking
    response = jsonify({"job_id": job_id})
    return response, 202


@app.route("/progress/<job_id>", methods=["GET"])
def get_progress(job_id):
    """Get the progress of a processing job"""
    if job_id not in jobs:
        return jsonify(error="Job not found"), 404
        
    job = jobs[job_id]
    response = jsonify({
    "progress": job["progress"],
    "status": job["status"],
    "complete": job["complete"]
})

    return response


@app.route("/results/<job_id>", methods=["GET"])
def get_results(job_id):
    """Get the final results of a completed job"""
    if job_id not in jobs:
        return jsonify(error="Job not found"), 404
        
    job = jobs[job_id]
    if not job["complete"]:
        return jsonify(error="Job still in progress"), 202
        
    if "error" in job:
        return jsonify(error=job["error"]), 500
        
    response = jsonify(job["result"])
    return response, 200


# Add a route to clear old jobs (for maintenance)
@app.route("/admin/clear-jobs", methods=["POST"])
def clear_jobs():
    """Admin route to clear completed jobs"""
    # In production, add authentication for this endpoint
    count = 0
    for job_id in list(jobs.keys()):
        if jobs[job_id]["complete"]:
            del jobs[job_id]
            count += 1
    
    return jsonify({"cleared_jobs": count}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=True)