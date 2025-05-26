# 1. Use official Python slim image
FROM python:3.11-slim

# 2. Set working directory
WORKDIR /app

# 3. Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy application code
COPY . .

# 5. Expose port and set environment variable
ENV PORT 8080
EXPOSE 8080

# 6. Use Gunicorn for production
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app", "--workers", "2"]