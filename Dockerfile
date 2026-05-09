FROM ubuntu:22.04

# Avoid prompts during apt installs
ENV DEBIAN_FRONTEND=noninteractive

# Install curl, python3, pip, and nodejs
RUN apt-get update && apt-get install -y \
    curl \
    python3 \
    python3-pip \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory for ML model and Backend
WORKDIR /app

# 1. Setup ML Model
# Create ml-model directory
RUN mkdir -p /app/ml-model
COPY ml-model/requirements.txt /app/ml-model/
# Install Python dependencies globally
RUN pip3 install --no-cache-dir -r /app/ml-model/requirements.txt \
    # Also install joblib explicitly just in case
    && pip3 install --no-cache-dir joblib scikit-learn xgboost shap numpy

# Copy ML Model files
COPY ml-model /app/ml-model/

# 2. Setup Node.js Backend
WORKDIR /app/backend

# Copy package.json and install Node dependencies
COPY backend/package*.json ./
RUN npm install --production

# Copy backend source code
COPY backend ./

# Expose port
EXPOSE 5000

# Start the Node.js server
CMD ["npm", "start"]