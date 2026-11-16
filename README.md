# CardioSense — Heart Disease Prediction Platform

**CardioSense** is a full-stack machine learning web application that demonstrates heart disease risk prediction using a trained ML model. It combines a responsive React frontend with a FastAPI backend to collect health-related input features and return model-generated predictions.

> **Disclaimer:** CardioSense is an educational machine learning project. Its predictions are not medical advice, a clinical diagnosis, or a substitute for professional healthcare assessment.

## 🌐 Live Application

| Component | Link |
|---|---|
| **Frontend Application** | [CardioSense — Vercel](YOUR_VERCEL_URL) |
| **Backend API** | [FastAPI on Render](https://heart-disease-prediction-api-inu5.onrender.com/) |
| **API Documentation** | [Swagger UI](https://heart-disease-prediction-api-inu5.onrender.com/docs) |
| **Health Check** | [API Health](https://heart-disease-prediction-api-inu5.onrender.com/health) |
| **API Information** | [API Info](https://heart-disease-prediction-api-inu5.onrender.com/info) |

## ✨ Key Features

- **Machine Learning Prediction:** Generates a prediction using a trained heart disease classification model.
- **Interactive Dashboard:** Clean and responsive React-based user interface.
- **13 Input Features:** Collects the required numerical features for prediction.
- **REST API Integration:** Communicates with the FastAPI backend.
- **Real-Time API Status:** Displays backend connectivity status.
- **Prediction Results:** Presents the model output through a dedicated results panel.
- **Notification System:** Provides success and error notifications with audio feedback.
- **Responsive Design:** Supports desktop and mobile screen sizes.

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, JavaScript, HTML5, CSS3 |
| Frontend Build Tool | Vite |
| Backend | Python, FastAPI |
| Machine Learning | Scikit-learn |
| Model Serialization | Joblib |
| API Communication | REST API, JSON |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |
| Version Control | Git, GitHub |

## 🧠 Prediction Input Features

The application uses the following 13 features:

| Feature | Description |
|---|---|
| `age` | Age of the individual |
| `sex` | Sex category encoded in the dataset |
| `cp` | Chest pain type |
| `trestbps` | Resting blood pressure |
| `chol` | Serum cholesterol |
| `fbs` | Fasting blood sugar category |
| `restecg` | Resting electrocardiographic results |
| `thalach` | Maximum heart rate achieved |
| `exang` | Exercise-induced angina category |
| `oldpeak` | ST depression induced by exercise |
| `slope` | Slope of the peak exercise ST segment |
| `ca` | Number of major vessels |
| `thal` | Thalassemia category |

The frontend sends these features to the backend through the `/predict` endpoint.

## 🏗️ Project Architecture

```text
User
  |
  v
React Frontend (Vercel)
  |
  | HTTP POST Request
  v
FastAPI Backend (Render)
  |
  v
Input Processing
  |
  v
Trained ML Model
  |
  v
Prediction Result
  |
  v
React Results Dashboard
```

## 📁 Project Structure

```text
FastAPI_Heart_Disease/
│
├── app/
│   └── main.py
│
├── model/
│   └── heart_model.joblib
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── requirements.txt
├── Dockerfile
└── README.md
```

*Note: The structure above represents the main project components. Additional configuration and supporting files may also be present.*

## 🚀 Run the Frontend Locally

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd FastAPI_Heart_Disease
```

### 2. Navigate to the Frontend

```bash
cd frontend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure the API URL

Create a `.env.local` file inside the `frontend/` directory:

```env
VITE_API_BASE_URL=https://heart-disease-prediction-api-inu5.onrender.com
```

### 5. Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

### 6. Create a Production Build

```bash
npm run build
```

The production build will be generated in:

```text
frontend/dist/
```

## ⚙️ Backend API

**Base URL:**

```text
https://heart-disease-prediction-api-inu5.onrender.com
```

### Available Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | API welcome message |
| GET | `/health` | Check API health |
| GET | `/info` | Retrieve API information |
| POST | `/predict` | Generate a model prediction |
| GET | `/docs` | Interactive Swagger documentation |

### Prediction Request

**Endpoint:**

```http
POST /predict
```

**Example JSON structure:**

```json
{
  "age": 45,
  "sex": 1,
  "cp": 0,
  "trestbps": 120,
  "chol": 200,
  "fbs": 0,
  "restecg": 1,
  "thalach": 150,
  "exang": 0,
  "oldpeak": 1.0,
  "slope": 1,
  "ca": 0,
  "thal": 2
}
```

The values above are illustrative request data, not a medical recommendation.

**Example Response Structure:**

```json
{
  "heart_disease": false
}
```

The actual response is determined by the deployed API.

## ☁️ Deployment

### Frontend — Vercel

The React application is deployed using Vercel.

- Framework: Vite
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable:

```env
VITE_API_BASE_URL=https://heart-disease-prediction-api-inu5.onrender.com
```

### Backend — Render

The FastAPI application is deployed using Render.

- Backend Framework: FastAPI
- Deployment Platform: Render
- API Server: Uvicorn
- Frontend access: Configured through the backend CORS settings.

**Important:** The deployed Vercel domain must be allowed by the backend CORS configuration.

## 🔒 Important Notes

- Do not commit `.env`, `.env.local`, or other environment-specific files.
- The API base URL is configured through a Vite environment variable.
- The backend must be running and accessible for predictions to work.
- The model output is intended for educational demonstration only.
- Do not submit real personal medical information to this demonstration application.

## 🎯 Project Objectives

1. Develop an end-to-end machine learning prediction application.
2. Integrate a trained classification model with a REST API.
3. Build an interactive frontend using React.
4. Connect the frontend and backend through HTTP requests.
5. Deploy the complete application using modern cloud platforms.

## 👨‍💻 Author

**Md Mahamudul Hasan**  
Computer Science and Engineering Student

- GitHub: [MdMahamudulHasan](https://github.com/MdMahamudulHasan)

---

⭐ If you find this project useful, consider giving the repository a star.

**CardioSense — Connecting Machine Learning with Interactive Web Applications.**
