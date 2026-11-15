# Heart Disease Prediction API

**🚀 Live Application:** https://heart-disease-prediction-api-inu5.onrender.com/

**📚 Interactive API Documentation (Swagger UI):** https://heart-disease-prediction-api-inu5.onrender.com/docs

**💚 Health Check:** https://heart-disease-prediction-api-inu5.onrender.com/health

**ℹ️ Model Information:** https://heart-disease-prediction-api-inu5.onrender.com/info

---

## 📌 Project Overview

The **Heart Disease Prediction API** is a Machine Learning-based REST API developed using **Python, Scikit-learn, FastAPI, and Docker**. It uses a Logistic Regression classification model to predict the presence or absence of heart disease based on 13 input features.

The trained machine learning model is integrated into a FastAPI application and containerized using Docker. The application is deployed online using Render, making the prediction service accessible through HTTP requests.

## 🎯 Project Objectives

- Build a Machine Learning model for binary classification.
- Train and evaluate a Logistic Regression model using the Heart Disease dataset.
- Develop REST API endpoints using FastAPI.
- Validate input data using Pydantic.
- Containerize the application using Docker.
- Deploy the API to Render.
- Provide interactive API testing through Swagger UI.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Python | Programming language |
| Pandas | Data manipulation |
| NumPy | Numerical operations |
| Scikit-learn | Machine Learning |
| Logistic Regression | Classification algorithm |
| Joblib | Model serialization |
| FastAPI | REST API development |
| Pydantic | Input validation |
| Uvicorn | ASGI server |
| Docker | Application containerization |
| Render | Cloud deployment |
| Git & GitHub | Version control and project hosting |

## 📂 Project Structure

```text
FastAPI_Heart_Disease/
│
├── app/
│   ├── __init__.py
│   ├── main.py
│   └── schemas.py
│
├── model/
│   └── heart_model.joblib
│
├── data/
│   └── heart.csv
│
├── train_model.py
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .gitignore
└── README.md
```

## 📊 Dataset Information

**Dataset:** [Heart Disease Dataset – Kaggle](https://www.kaggle.com/datasets/johnsmith88/heart-disease-dataset)

The dataset contains 13 input features and one target variable.

### Input Features

| Feature | Description |
|---|---|
| age | Age of the individual |
| sex | Sex category encoded in the dataset |
| cp | Chest pain type |
| trestbps | Resting blood pressure |
| chol | Serum cholesterol |
| fbs | Fasting blood sugar |
| restecg | Resting electrocardiographic results |
| thalach | Maximum heart rate achieved |
| exang | Exercise-induced angina |
| oldpeak | ST depression |
| slope | Slope of the ST segment |
| ca | Number of major vessels |
| thal | Thalassemia category |

**Target Variable:**
- `0` – Absence of heart disease in the dataset
- `1` – Presence of heart disease in the dataset

## 🤖 Machine Learning Workflow

1. Load the Heart Disease dataset.
2. Separate input features and target variable.
3. Split the dataset into training and testing sets (80:20).
4. Apply StandardScaler for feature scaling.
5. Train a Logistic Regression classifier.
6. Evaluate the model using accuracy and classification metrics.
7. Save the trained pipeline using Joblib.
8. Load the saved model into the FastAPI application.

### Model Configuration

- Algorithm: Logistic Regression
- Feature Scaling: StandardScaler
- Training/Test Split: 80% / 20%
- Random State: 42
- Maximum Iterations: 1000

## ⚡ API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API welcome message |
| GET | `/health` | Check API health |
| GET | `/info` | Retrieve model information |
| POST | `/predict` | Generate a prediction |

## 🧪 API Testing

The API can be tested directly through the interactive Swagger documentation.

**Step 1:** Open the API documentation:

https://heart-disease-prediction-api-inu5.onrender.com/docs

**Step 2:** Expand `POST /predict`.

**Step 3:** Click **Try it out**.

**Step 4:** Provide the following sample JSON:

```json
{
  "age": 55,
  "sex": 1,
  "cp": 0,
  "trestbps": 140,
  "chol": 250,
  "fbs": 0,
  "restecg": 1,
  "thalach": 150,
  "exang": 0,
  "oldpeak": 1.5,
  "slope": 1,
  "ca": 0,
  "thal": 2
}
```

**Step 5:** Click **Execute** to receive the prediction response.

### Example Response

```json
{
  "heart_disease": false
}
```

*Note: The actual prediction depends on the input data and the trained model. The example response is illustrative.*

## 🐳 Run the Project Locally

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the Project Directory

```bash
cd FastAPI_Heart_Disease
```

### 3. Create a Virtual Environment

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Train the Machine Learning Model (if needed)

Make sure the dataset is available at `data/heart.csv`.

```bash
python train_model.py
```

This generates the trained model at:

```text
model/heart_model.joblib
```

### 6. Start the FastAPI Application

```bash
uvicorn app.main:app --reload
```

### 7. Open the Local API

- Application: http://127.0.0.1:8000/
- Swagger Documentation: http://127.0.0.1:8000/docs
- Health Check: http://127.0.0.1:8000/health

## 🐳 Run with Docker

Make sure Docker Desktop is installed and running.

### Build the Docker Image

```bash
docker build -t heart-disease-api .
```

### Run the Container

```bash
docker run -d -p 8000:8000 --name heart-disease-api heart-disease-api
```

### Alternatively, Use Docker Compose

```bash
docker compose up --build
```

Access the application:

http://localhost:8000/docs

To stop the Docker Compose service:

```bash
docker compose down
```

## ☁️ Deployment

The application is deployed on **Render** using Docker.

Deployment workflow:

1. Push the project source code to GitHub.
2. Create a new Web Service on Render.
3. Connect the GitHub repository.
4. Select Docker as the runtime environment.
5. Configure the deployment.
6. Deploy the application.
7. Verify the live API using the `/health` endpoint.

**Deployment Platform:** [Render](https://render.com/)

## 🔒 Important Notes

- The trained model is saved using Joblib.
- The same Scikit-learn version should be used for model training and deployment to avoid model compatibility warnings.
- The `data/` directory can be excluded from GitHub if the dataset is separately downloaded when retraining.
- The trained model file must be included in the repository for the provided Docker build process.

## ⚠️ Disclaimer

This project is developed for **educational and machine learning demonstration purposes only**. Its predictions are based on a public dataset and should not be used for medical diagnosis, treatment decisions, or clinical assessment.

## 👨‍💻 Author

**Md Mahamudul Hasan**

Computer Science and Engineering Student

GitHub: [MdMahamudulHasan](https://github.com/MdMahamudulHasan)

---

⭐ If you find this project useful, consider giving the repository a star!
