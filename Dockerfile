# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with FastAPI
FROM python:3.12-slim
WORKDIR /app

# Install build dependencies that psycopg2 might need
RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy FastAPI backend code
COPY api/ ./api/

# Copy built frontend from Stage 1 into the /dist directory
COPY --from=frontend-builder /app/dist/ ./dist/

# Create a shell script to run Uvicorn mapping natively to Railway's PORT env variable
CMD uvicorn api.main:app --host 0.0.0.0 --port ${PORT:-8000}
