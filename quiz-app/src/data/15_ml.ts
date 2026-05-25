import type { Topic } from "../types";
import { mcq, tf, match } from "./_helpers";

export const topic15: Topic = {
  id: "15-ml",
  number: "15",
  title: "Machine Learning & AI",
  weight: "Useful",
  blurb:
    "SageMaker + the AI-services stack (Rekognition, Comprehend, Transcribe, etc).",
  sections: [
    {
      id: "ai-stack",
      title: "AI Services One-Liners",
      questions: [
        match("15-ai-m1", "Match each AI service to its purpose.", [
          { left: "Rekognition", right: "Image & video analysis" },
          { left: "Comprehend", right: "NLP / sentiment / entities" },
          { left: "Comprehend Medical", right: "Medical text analysis" },
          { left: "Transcribe", right: "Speech-to-text" },
          { left: "Polly", right: "Text-to-speech" },
          { left: "Translate", right: "Language translation" },
          { left: "Textract", right: "OCR + form/table extraction" },
          { left: "Lex", right: "Conversational bots" },
          { left: "Personalize", right: "Recommendations" },
          { left: "Forecast", right: "Time-series forecasts" },
          { left: "Fraud Detector", right: "Fraud ML model" },
          { left: "Kendra", right: "Enterprise document search" },
          { left: "Bedrock", right: "Foundation models (GenAI)" },
          { left: "Q", right: "GenAI business assistant" },
        ]),
        mcq(
          "15-ai-1",
          "Extract text + tables from scanned PDFs:",
          ["Rekognition", "Textract", "Comprehend", "Transcribe"],
          1,
          "Textract = OCR + structured form/table extraction.",
        ),
        mcq(
          "15-ai-2",
          "Build a chatbot like Alexa:",
          ["Polly", "Transcribe", "Lex", "Comprehend"],
          2,
          "Lex = ASR + NLU for chatbots.",
        ),
      ],
    },
    {
      id: "sagemaker",
      title: "SageMaker Components",
      questions: [
        match("15-sm-m1", "Match each SageMaker feature.", [
          { left: "Studio", right: "IDE for ML" },
          { left: "Ground Truth", right: "Data labeling service" },
          { left: "Autopilot", right: "AutoML" },
          { left: "JumpStart", right: "Pre-built models / solutions" },
          { left: "Pipelines", right: "ML CI/CD" },
          { left: "Model Monitor", right: "Detect drift in production" },
          { left: "Feature Store", right: "Centralized features" },
          { left: "Clarify", right: "Bias + explainability" },
          { left: "Data Wrangler", right: "Data prep" },
          {
            left: "Inference endpoints",
            right: "Real-time / async / batch / serverless",
          },
        ]),
        mcq(
          "15-sm-1",
          "Detect model performance drift in produc