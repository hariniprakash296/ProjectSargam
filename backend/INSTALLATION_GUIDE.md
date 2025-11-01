# Backend Setup Guide - Troubleshooting

## Issue: Python 3.12 Compatibility

If you're using Python 3.12 and getting errors about `distutils`:

**Problem**: Python 3.12 removed `distutils`, and older numpy versions (1.24.x) require it.

**Solution**: Updated `requirements.txt` to use:
- `numpy>=1.26.0` (compatible with Python 3.12)
- `scipy>=1.11.4` (compatible with newer numpy)

## Installation Steps

### Option 1: Using Virtual Environment (Recommended)

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
py -m venv venv

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# If you get an execution policy error, run:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Upgrade pip and build tools
py -m pip install --upgrade pip setuptools wheel

# Install requirements
pip install -r requirements.txt
```

### Option 2: Global Installation (Not Recommended)

If you prefer global installation:

```powershell
cd backend
py -m pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

**Note**: You may see dependency conflict warnings with other globally installed packages (like langchain, mcp). These won't affect the backend if you use a virtual environment.

## Common Issues

### Issue 1: "No module named 'distutils'"
- **Cause**: Python 3.12 removed distutils
- **Fix**: Use numpy>=1.26.0 (already updated in requirements.txt)

### Issue 2: "pip installation failed"
- **Cause**: Outdated pip or build tools
- **Fix**: Run `py -m pip install --upgrade pip setuptools wheel`

### Issue 3: "Invalid distribution ~cp"
- **Cause**: Corrupted pip cache
- **Fix**: This is usually harmless, but you can clear cache:
  ```powershell
  pip cache purge
  ```

### Issue 4: Dependency Conflicts
- **Cause**: Global packages conflicting with requirements
- **Fix**: Use a virtual environment to isolate dependencies

## Verify Installation

After installation, verify everything works:

```powershell
cd backend
python -c "import fastapi, librosa, numpy; print('All packages installed successfully!')"
```

If you see "All packages installed successfully!", you're good to go!

## Running the Backend

```powershell
cd backend
python main.py
```

Or with uvicorn directly:

```powershell
cd backend
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

