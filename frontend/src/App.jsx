
import { useEffect, useState } from "react";
import React, { useRef } from "react";
import {
  Activity,
  HeartPulse,
  ShieldCheck,
  BrainCircuit,
  ArrowRight,
  RefreshCw,
  Stethoscope,
  Server,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  Bell,
  Clock3,
} from "lucide-react";
import "./App.css";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://heart-disease-prediction-api-inu5.onrender.com"
).replace(/\/+$/, "");

const initialValues = {
  age: "55",
  sex: "1",
  cp: "0",
  trestbps: "140",
  chol: "250",
  fbs: "0",
  restecg: "1",
  thalach: "150",
  exang: "0",
  oldpeak: "1.5",
  slope: "1",
  ca: "0",
  thal: "2",
};

const sections = [
  {
    title: "Personal Information",
    description: "Basic demographic dataset features",
    fields: [
      { key: "age", label: "Age", unit: "Years", step: "1", min: "1", max: "120" },
      { key: "sex", label: "Sex", unit: "Encoded: 0 or 1", step: "1", min: "0", max: "1" },
    ],
  },
  {
    title: "Clinical Measurements",
    description: "Recorded measurements from the dataset",
    fields: [
      { key: "trestbps", label: "Resting Blood Pressure", unit: "mm Hg", step: "any", min: "0" },
      { key: "chol", label: "Serum Cholesterol", unit: "mg/dl", step: "any", min: "0" },
      { key: "thalach", label: "Maximum Heart Rate", unit: "BPM", step: "any", min: "0" },
      { key: "oldpeak", label: "Oldpeak", unit: "ST depression", step: "any", min: "0" },
    ],
  },
  {
    title: "Dataset-Coded Features",
    description: "Categorical values encoded in the original dataset",
    fields: [
      { key: "cp", label: "Chest Pain Type", unit: "Encoded: 0–3", step: "1", min: "0", max: "3" },
      { key: "fbs", label: "Fasting Blood Sugar", unit: "Encoded: 0 or 1", step: "1", min: "0", max: "1" },
      { key: "restecg", label: "Resting ECG", unit: "Encoded: 0–2", step: "1", min: "0", max: "2" },
      { key: "exang", label: "Exercise-Induced Angina", unit: "Encoded: 0 or 1", step: "1", min: "0", max: "1" },
      { key: "slope", label: "ST Segment Slope", unit: "Encoded: 0–2", step: "1", min: "0", max: "2" },
      { key: "ca", label: "Major Vessels (CA)", unit: "Encoded: 0–4", step: "1", min: "0", max: "4" },
      { key: "thal", label: "Thal", unit: "Encoded: 0–3", step: "1", min: "0", max: "3" },
    ],
  },
];


function playNotificationSound(audioContext, type = "success") {
  if (!audioContext || audioContext.state !== "running") return;

  const frequencies =
    type === "error" ? [330, 260] : [660, 880];

  frequencies.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    const startTime = audioContext.currentTime + index * 0.14;

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.10, startTime + 0.025);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      startTime + 0.23
    );

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.24);
  });
}


function App() {
  const [values, setValues] = useState(initialValues);
  const [apiStatus, setApiStatus] = useState("checking");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);
  const audioContextRef = useRef(null);

  // Automatically dismiss notifications after 5 seconds.
  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification]);

  // Check backend API connection.
  useEffect(() => {
    let active = true;

    async function checkAPI() {
      try {
        const response = await fetch(`${API_BASE_URL}/health`);

        if (!response.ok) {
          throw new Error("API unavailable");
        }

        const data = await response.json();

        if (active) {
          setApiStatus(
            data.status === "healthy" ? "connected" : "offline"
          );
        }
      } catch {
        if (active) {
          setApiStatus("offline");
        }
      }
    }

    checkAPI();

    return () => {
      active = false;
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // Initialize audio during the user's button interaction.
    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (AudioContextClass && !audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }

      if (audioContextRef.current?.state === "suspended") {
        audioContextRef.current.resume();
      }
    } catch (audioError) {
      console.warn("Audio initialization unavailable:", audioError);
    }

    setLoading(true);
    setError("");
    setResult(null);
    setNotification(null);

    try {
      const payload = {};

      for (const [key, value] of Object.entries(values)) {
        if (value.trim() === "" || !Number.isFinite(Number(value))) {
          throw new Error(`Please enter a valid value for ${key}.`);
        }

        payload[key] = Number(value);
      }

      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Prediction request failed. Please try again."
        );
      }

      if (typeof data.heart_disease !== "boolean") {
        throw new Error("Unexpected response received from the API.");
      }

      setResult(data);

      // Success notification
      setNotification({
        type: "success",
        title: "Prediction Completed",
        message:
          "Your model output has been successfully generated and displayed.",
      });

      // Play success sound
      playNotificationSound(audioContextRef.current, "success");

      // Scroll to prediction result
      setTimeout(() => {
        document.getElementById("prediction-result")?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);

    } catch (err) {
      const message =
        err.message || "Unable to connect to the prediction service.";

      setError(message);

      // Error notification
      setNotification({
        type: "error",
        title: "Prediction Failed",
        message,
      });

      // Play error sound
      playNotificationSound(audioContextRef.current, "error");

    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setValues(initialValues);
    setResult(null);
    setError("");
    setNotification(null);
  }

  const apiConnected = apiStatus === "connected";

  return (
    <div className="app">

      {/* ================= NOTIFICATION ================= */}

      {notification && (
        <div
          className={`notification-toast ${
            notification.type === "error" ? "notification-error" : "notification-success"
          }`}
          role={notification.type === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              flexShrink: 0,
              borderRadius: "12px",
              display: "grid",
              placeItems: "center",
              color:
                notification.type === "error" ? "#dc2626" : "#07866f",
              background:
                notification.type === "error" ? "#fef2f2" : "#e7f7f1",
            }}
          >
            {notification.type === "error" ? (
              <AlertCircle size={22} />
            ) : (
              <CheckCircle2 size={22} />
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#163b43",
                marginBottom: "5px",
              }}
            >
              {notification.title}
            </div>

            <div
              style={{
                fontSize: "12px",
                lineHeight: 1.6,
                color: "#71828d",
              }}
            >
              {notification.message}
            </div>

            <div
              style={{
                marginTop: "9px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "10px",
                color: "#82939b",
              }}
            >
              <Clock3 size={12} />
              CardioSense AI Notification
            </div>
          </div>

          <button
            type="button"
            onClick={() => setNotification(null)}
            aria-label="Close notification"
            style={{
              border: "none",
              background: "transparent",
              color: "#82939b",
              padding: "3px",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* ================= NAVBAR ================= */}

      <header className="navbar">
        <a className="brand" href="#home">
          <div className="brand-icon">
            <HeartPulse size={25} />
          </div>

          <div>
            <span className="brand-name">CardioSense</span>
            <span className="brand-subtitle">AI HEALTH TECHNOLOGY</span>
          </div>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#prediction">Prediction</a>
          <a href="#about">About</a>
        </nav>

        <div
          className={`api-indicator ${
            apiConnected ? "online" : "offline"
          }`}
        >
          <span className="status-dot" />

          {apiStatus === "checking"
            ? "Checking API"
            : apiConnected
              ? "API Connected"
              : "API Offline"}
        </div>
      </header>

      <main>

        {/* ================= HERO ================= */}

        <section className="hero" id="home">
          <div className="hero-content">
            <div className="eyebrow">
              <Activity size={15} />
              MACHINE LEARNING POWERED DEMO
            </div>

            <h1>
              Smarter insights.
              <br />
              <span>Powered by AI.</span>
            </h1>

            <p>
              Explore a machine learning demonstration that analyzes
              structured heart-health dataset features and generates
              a model prediction.
            </p>

            <a className="primary-button" href="#prediction">
              Explore Prediction
              <ArrowRight size={18} />
            </a>

            <div className="hero-note">
              <ShieldCheck size={17} />
              Educational machine learning demonstration
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-circle circle-one" />
            <div className="visual-circle circle-two" />

            <div className="heart-card">
              <div className="heart-card-top">
                <span>CardioSense AI</span>
                <Activity size={18} />
              </div>

              <div className="heart-graphic">
                <HeartPulse size={100} strokeWidth={1.15} />
              </div>

              <div className="wave-line">
                <span />
              </div>

              <div className="visual-caption">
                <span>ML CLASSIFICATION</span>
                <strong>Logistic Regression</strong>
              </div>
            </div>

            <div className="floating-icon icon-top">
              <BrainCircuit size={23} />
            </div>

            <div className="floating-icon icon-bottom">
              <ShieldCheck size={23} />
            </div>
          </div>
        </section>

        {/* ================= STATS ================= */}

        <section className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">
              <BrainCircuit />
            </div>
            <div>
              <strong>ML Model</strong>
              <span>Logistic Regression</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Activity />
            </div>
            <div>
              <strong>13 Features</strong>
              <span>Structured input variables</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Server />
            </div>
            <div>
              <strong>FastAPI</strong>
              <span>Live prediction service</span>
            </div>
          </div>
        </section>

        {/* ================= PREDICTION ================= */}

        <section className="prediction-section" id="prediction">
          <div className="section-heading">
            <div className="eyebrow">
              <Stethoscope size={15} />
              MODEL INTERFACE
            </div>

            <h2>Heart Health Prediction</h2>

            <p>
              Enter the 13 features required by the trained machine
              learning model.
            </p>
          </div>

          <div className="prediction-layout">

            {/* INPUT FORM */}

            <form className="prediction-form" onSubmit={handleSubmit}>
              {sections.map((section) => (
                <div className="form-section" key={section.title}>
                  <div className="form-section-heading">
                    <div>
                      <h3>{section.title}</h3>
                      <p>{section.description}</p>
                    </div>
                  </div>

                  <div className="input-grid">
                    {section.fields.map((field) => (
                      <label className="input-group" key={field.key}>
                        <span className="input-label">
                          {field.label}
                        </span>

                        <input
                          type="number"
                          name={field.key}
                          value={values[field.key]}
                          onChange={handleChange}
                          step={field.step}
                          min={field.min}
                          max={field.max}
                          required
                        />

                        <span className="input-unit">
                          {field.unit}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {/* FORM ACTIONS */}

              <div className="form-actions">
                <button
                  type="button"
                  className="reset-button"
                  onClick={resetForm}
                  disabled={loading}
                >
                  <RefreshCw size={16} />
                  Reset Form
                </button>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading || !apiConnected}
                >
                  {loading ? (
                    <>
                      <RefreshCw
                        size={17}
                        style={{ animation: "cardioSpin 1s linear infinite" }}
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      Generate Prediction
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>

              {!apiConnected && (
                <p className="connection-warning">
                  API is not connected. Wait for the service to become
                  available before submitting.
                </p>
              )}

              <p
                style={{
                  fontSize: "11px",
                  color: "#82939b",
                  marginTop: "12px",
                  lineHeight: 1.6,
                }}
              >
                This form is designed for an educational machine learning
                demonstration. It does not provide clinical assessment.
              </p>
            </form>

            {/* RESULT PANEL */}

            <aside className="result-panel" id="prediction-result">
              <div className="result-panel-header">
                <div className="result-icon">
                  <Activity size={22} />
                </div>

                <div>
                  <h3>Prediction Result</h3>
                  <p>Machine learning output</p>
                </div>
              </div>

              {/* EMPTY STATE */}

              {!result && !error && (
                <div className="empty-result">
                  <div className="empty-icon">
                    <BrainCircuit size={42} />
                  </div>

                  <h3>Awaiting Input</h3>

                  <p>
                    Complete the feature form and generate a prediction
                    to view the model output here.
                  </p>

                  <div
                    style={{
                      marginTop: "18px",
                      padding: "12px",
                      borderRadius: "10px",
                      background: "#f2f7fa",
                      color: "#71828d",
                      fontSize: "11px",
                    }}
                  >
                    <Bell size={14} style={{ verticalAlign: "middle" }} />
                    {" "}A notification will appear after prediction.
                  </div>
                </div>
              )}

              {/* SUCCESS RESULT */}

              {result && (
                <div className="result-content">
                  <div
                    className={`result-status ${
                      result.heart_disease
                        ? "result-positive"
                        : "result-negative"
                    }`}
                  >
                    {result.heart_disease ? (
                      <AlertCircle size={32} />
                    ) : (
                      <CheckCircle2 size={32} />
                    )}

                    <span>
                      {result.heart_disease
                        ? "Model Output: 1"
                        : "Model Output: 0"}
                    </span>
                  </div>

                  <h3>
                    {result.heart_disease
                      ? "Presence predicted"
                      : "Absence predicted"}
                  </h3>

                  <p>
                    {result.heart_disease
                      ? "The model classified this input as the presence of heart disease in the dataset."
                      : "The model classified this input as the absence of heart disease in the dataset."}
                  </p>

                  <div className="result-disclaimer">
                    <Info size={17} />
                    This is a dataset-based model prediction, not a medical
                    diagnosis.
                  </div>
                </div>
              )}

              {/* ERROR RESULT */}

              {error && (
                <div className="error-box">
                  <AlertCircle size={27} />

                  <h3>Request Failed</h3>

                  <p>{error}</p>

                  <button
                    type="button"
                    onClick={() => setError("")}
                  >
                    Dismiss
                  </button>
                </div>
              )}

              <div className="result-footer">
                <span>Powered by</span>
                <strong>Scikit-learn + FastAPI</strong>
              </div>
            </aside>
          </div>
        </section>

        {/* ================= ABOUT ================= */}

        <section className="about-section" id="about">
          <div>
            <div className="eyebrow">ABOUT THE PROJECT</div>

            <h2>Machine learning meets healthcare data.</h2>

            <p>
              CardioSense is an educational software project demonstrating
              how a trained classification pipeline can be integrated
              into a modern web application.
            </p>
          </div>

          <div className="about-points">
            <div>
              <CheckCircle2 /> React frontend
            </div>
            <div>
              <CheckCircle2 /> FastAPI REST API
            </div>
            <div>
              <CheckCircle2 /> Scikit-learn pipeline
            </div>
            <div>
              <CheckCircle2 /> Docker deployment
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}

      <footer className="footer">
        <a className="footer-brand" href="#home">
          <HeartPulse size={19} />
          CardioSense
        </a>

        <p>Built as an educational machine learning project.</p>

        <span>© 2026 CardioSense</span>
      </footer>

      <div className="disclaimer">
        <ShieldCheck size={17} />
        <p>
          Disclaimer: This application is for educational and research
          demonstration only. It is not intended for medical diagnosis
          or clinical decision-making.
        </p>
      </div>

      {/* ================= ANIMATIONS ================= */}

      <style>{`
        @keyframes cardioToastIn {
          from {
            opacity: 0;
            transform: translateX(25px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes cardioSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default App;
