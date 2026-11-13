
from pydantic import BaseModel, ConfigDict

class HeartDiseaseInput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    age: int
    sex: int
    cp: int
    trestbps: float
    chol: float
    fbs: int
    restecg: int
    thalach: float
    exang: int
    oldpeak: float
    slope: int
    ca: float
    thal: int

class PredictionResponse(BaseModel):
    heart_disease: bool