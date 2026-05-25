# AWS SAA-C03 — 15 · Machine Learning & AI

> SageMaker + the AI service stack. SAA-C03 only tests **when to use which AI service** — not how to train models.

---

## The AI Service Stack — Memorize One-Liners

| Service | Purpose | Keyword |
|---------|---------|---------|
| **SageMaker** | Build/train/deploy custom ML models, end-to-end | "custom ML model" |
| **Rekognition** | Image & video analysis (faces, objects, moderation, text in images) | "detect faces / objects in images" |
| **Textract** | Extract text + tables + forms from documents (OCR+) | "extract data from scanned forms/PDFs" |
| **Comprehend** | NLP: sentiment, entities, key phrases, language, PII detection | "sentiment analysis on text" |
| **Comprehend Medical** | NLP for medical text | "extract diagnoses from clinical notes" |
| **Translate** | Neural machine translation | "translate languages" |
| **Polly** | Text → speech (TTS) | "convert text to lifelike voice" |
| **Transcribe** | Speech → text (STT) | "transcribe customer calls" |
| **Transcribe Medical** | STT for medical | "transcribe doctor notes" |
| **Lex** | Conversational chatbots (powers Alexa) | "build chatbot with voice/text" |
| **Kendra** | Enterprise search with NLP across many sources | "search internal docs with natural language" |
| **Personalize** | Real-time personalized recommendations | "product recommendations" |
| **Forecast** | Time-series forecasting | "demand forecasting" |
| **Fraud Detector** | Detect online fraud | "detect fraudulent transactions" |
| **CodeGuru** | Code reviews + perf profiling (Java/Python) | "automated code review" |
| **DevOps Guru** | Detect operational anomalies | "detect ops issues with ML" |
| **Lookout for Equipment / Vision / Metrics** | Industrial / visual / business anomaly detection | "predict equipment failure" |
| **Monitron** | End-to-end industrial monitoring (sensors) | — |
| **HealthLake** | FHIR-compliant health data store | — |
| **Augmented AI (A2I)** | Human review for ML predictions | "human-in-the-loop" |
| **Bedrock** | Foundation model access (Claude, Llama, Titan, etc.) | "access LLMs via API" |
| **Q Developer / Q Business** | AI assistant (code / enterprise) | "AI assistant" |

---

## SageMaker (the umbrella)

| Component | Purpose |
|-----------|---------|
| **Studio** | IDE for ML |
| **Notebooks** | Managed Jupyter |
| **Training Jobs** | Spin up training clusters (Spot OK) |
| **Hosting / Endpoints** | Real-time inference; serverless inference; async inference; batch transform |
| **Ground Truth** | Labeling with human workers (Mechanical Turk) |
| **Feature Store** | Centralized feature management |
| **Pipelines** | ML workflows |
| **Model Monitor** | Detect data drift |
| **Autopilot** | AutoML |
| **JumpStart** | Pre-trained models / solutions |
| **Canvas** | No-code ML for business analysts |

---

## Self-Test

- Service for OCR + table extraction?
- Service for sentiment analysis?
- Service for product recommendations?
- Service to access LLM APIs?
- Service to label training data with humans?
