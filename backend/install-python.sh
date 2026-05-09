#!/bin/bash
echo "==> Setting up local Python environment..."

# Download and extract standalone Python (Linux x86_64) to a local folder
wget https://github.com/indygreg/python-build-standalone/releases/download/20240224/cpython-3.11.8+20240224-x86_64-unknown-linux-gnu-install_only.tar.gz -O python.tar.gz
mkdir -p .local_python
tar -xf python.tar.gz -C .local_python
rm python.tar.gz

# Set up PATH for the rest of the build and for runtime
export PATH="$(pwd)/.local_python/python/bin:$PATH"

echo "==> Python version installed:"
python3 --version

echo "==> Installing ML dependencies..."
pip3 install --no-cache-dir numpy scikit-learn shap joblib xgboost

echo "==> Done!"
