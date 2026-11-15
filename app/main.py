
import os
import joblib
import pandas as pd

from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import HeartDiseaseInput, PredictionResponse

# 1. Initialize FastAPI
app = FastAPI(
    title="Heart Disease Prediction API",
    description="An educational ML prediction API using FastAPI.",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

# 2. Load trained model
BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "model" / "heart_model.joblib"

try:
    model = joblib.load(MODEL_PATH)
except Exception as exc:
    raise RuntimeError(
        f"Could not load model from {MODEL_PATH}"
    ) from exc

# 3. Define feature order
FEATURES = [
    "age",
    "sex",
    "cp",
    "trestbps",
    "chol",
    "fbs",
    "restecg",
    "thalach",
    "exang",
    "oldpeak",
    "slope",
    "ca",
    "thal"
]

# 4. Health endpoint
@app.get("/health")
def health_check():

    return {
        "status": "healthy",
        "model_loaded": model is not None
    }

# 5. Information endpoint
@app.get("/info")
def model_info():

    return {
        "model_name": "Heart Disease Classifier",
        "model_type": "Logistic Regression",
        "framework": "Scikit-learn",
        "version": "1.0.0",
        "input_features": FEATURES,
        "output": "heart_disease",
        "task": "Binary Classification"
    }

# 6. Prediction endpoint
@app.post(
    "/predict",
    response_model=PredictionResponse
)
def predict(data: HeartDiseaseInput):

    try:
        input_data = pd.DataFrame(
            [data.model_dump()],
            columns=FEATURES
        )

        prediction = model.predict(input_data)[0]

        return {
            "heart_disease": bool(prediction == 1)
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Prediction failed."
        ) from exc

# 7. Local application entry point
if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port
    )

@app.get("/")
def home():
    return {
        "message": "Heart Disease Prediction API is running!",
        "docs": "/docs",
        "health": "/health",
        "info": "/info"
    }