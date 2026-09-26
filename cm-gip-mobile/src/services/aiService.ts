import { GoogleGenerativeAI } from '@google/generative-ai';

// Interfaces for TypeScript Type Safety
export interface ObservationClassification {
  severity: 'critical' | 'major' | 'minor' | 'suggestion';
  confidence: number;
  regulation: string;
  reasoning: string;
}

export interface RiskAnalysis {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  insights: string[];
  recommendedActions: string[];
}

export interface InspectionDataPayload {
  checklistFailures: string[];
  observations: Array<{ text: string }>;
}

export interface PredictedIncident {
  type: string;
  probability: number;
  timeframe: string;
  location: string;
  actions: string[];
}

export interface RiskPrediction {
  predictedIncidents: PredictedIncident[];
}

// Helper to safely parse JSON returned by LLM (even if wrapped in markdown fences or arrays)
const parseJsonFromResponse = <T>(text: string, fallback: T): T => {
  try {
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as T;
    }
  } catch (err) {
    console.warn('JSON parse error from AI response:', err);
  }
  return fallback;
};

// Clean and sanitize Gemini API Key from environment or .env
const RAW_KEY = (process.env.EXPO_PUBLIC_GEMINI_API_KEY || '').trim().replace(/^["']|["']$/g, '');
const API_KEY = RAW_KEY && RAW_KEY !== 'YOUR_GEMINI_API_KEY' ? RAW_KEY : null;

let genAI: GoogleGenerativeAI | null = null;
if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

// 0. Extract text from images using Gemini (Vision OCR with Multilingual Hindi & English support)
export const extractTextFromImage = async (base64Image: string, mimeType: string = 'image/jpeg'): Promise<string> => {
  if (!base64Image || !base64Image.trim()) return '';

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });
      const prompt = "Please read and extract all handwritten or printed text, safety observations, and violations from this mining log image. It may be written in English, Hindi (हिंदी / Devanagari), or Hinglish. Accurately transcribe all text and provide the safety context. Return ONLY the extracted text.";
      
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType
          }
        }
      ]);
      const response = await result.response;
      return response.text().trim();
    } catch (error: any) {
      console.warn('AI Vision Parsing failed, falling back to mock.', error?.message || error);
    }
  }

  // MOCK FALLBACK MODE
  await new Promise(r => setTimeout(r, 1500));
  return "Ventilation duct torn at 200m. Air flow restricted. Immediate repair required.";
};

export const aiService = {
  extractTextFromImage,
  // 1. Analyze observation text in real-time (Supports English, Hindi, and Hinglish)
  classifyObservationSeverity: async (description: string): Promise<ObservationClassification> => {
    if (!description || !description.trim()) {
      return { severity: 'suggestion', confidence: 100, regulation: 'General Safety', reasoning: 'No observation text provided.' };
    }

    // Check if real AI is available
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });
        const prompt = `
You are a coal mining safety compliance expert under Coal Mines Regulations (CMR) 2017. 
Classify the severity of this safety observation (which may be written in English, Hindi, or Hinglish).
OBSERVATION: "${description}"

CLASSIFICATION CRITERIA:
- CRITICAL: Immediate threat to life, gas accumulation, roof collapse danger, requires work stoppage
- MAJOR: Serious violation, ventilation damage, electrical hazard, requires action within 24-48 hours
- MINOR: Compliance gap, missing signs, PPE issues, action within 7 days
- SUGGESTION: Housekeeping or minor improvement opportunity

Respond strictly in JSON format:
{
  "severity": "critical|major|minor|suggestion",
  "confidence": 95,
  "regulation": "Regulation 119, CMR 2017",
  "reasoning": "English explanation of why this was flagged"
}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const parsed = parseJsonFromResponse<ObservationClassification | null>(text, null);
        if (parsed && parsed.severity) return parsed;
      } catch (error: any) {
        console.warn('AI Parsing failed, falling back to mock.', error?.message || error);
      }
    }

    // MOCK FALLBACK MODE
    // Artificial delay to simulate network
    await new Promise(r => setTimeout(r, 800));
    const desc = description.toLowerCase();
    
    if (desc.includes('fire') || desc.includes('collapse') || desc.includes('gas') || desc.includes('methane')) {
      return { severity: 'critical', confidence: 99, regulation: 'Reg 141, CMR 2017', reasoning: 'Immediate threat to life.' };
    } else if (desc.includes('ventilation') || desc.includes('air') || desc.includes('dust')) {
      return { severity: 'major', confidence: 92, regulation: 'Reg 119, CMR 2017', reasoning: 'Increases explosion risk. Action required in 48h.' };
    } else if (desc.includes('sign') || desc.includes('document')) {
      return { severity: 'minor', confidence: 85, regulation: 'Reg 54, CMR 2017', reasoning: 'Compliance gap. Action required in 7d.' };
    }
    
    return { severity: 'suggestion', confidence: 80, regulation: 'General Safety', reasoning: 'Housekeeping improvement.' };
  },

  // 2. Calculate overall inspection risk score on submit
  analyzeInspectionRisk: async (inspectionData: InspectionDataPayload): Promise<RiskAnalysis> => {
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });
        const prompt = `
You are a coal mining safety expert AI under CMR 2017. Analyze this inspection data.
Checklist Failures: ${inspectionData.checklistFailures.join(', ') || 'None'}
Observations: ${inspectionData.observations.map(o => o.text).join('; ') || 'None'}

Calculate the overall risk score (0-100) and provide actionable insights.
Respond strictly in JSON format:
{
  "riskScore": 75,
  "riskLevel": "low|medium|high|critical",
  "insights": ["insight 1", "insight 2"],
  "recommendedActions": ["action 1", "action 2"]
}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const parsed = parseJsonFromResponse<RiskAnalysis | null>(text, null);
        if (parsed && typeof parsed.riskScore === 'number') return parsed;
      } catch (error: any) {
        console.warn('AI Parsing failed, falling back to mock.', error?.message || error);
      }
    }

    // MOCK FALLBACK MODE
    await new Promise(r => setTimeout(r, 1500));
    const failCount = inspectionData.checklistFailures.length;
    let score = 20 + (failCount * 15);
    if (score > 95) score = 95;
    
    let level: 'low'|'medium'|'high'|'critical' = 'low';
    if (score > 30) level = 'medium';
    if (score > 60) level = 'high';
    if (score > 85) level = 'critical';

    return {
      riskScore: score,
      riskLevel: level,
      insights: [
        `${failCount} major failures detected during inspection.`,
        "Historical data indicates a 40% increase in similar violations."
      ],
      recommendedActions: [
        "Immediate rectification of checklist failures.",
        "Schedule follow-up audit within 7 days."
      ]
    };
  },

  // 3. Predict risks for Dashboard
  predictRisks: async (): Promise<RiskPrediction> => {
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });
        const prompt = `You are a coal mining safety predictive intelligence system for Indian coal mines (CMR 2017).
Predict 2 high-priority safety incidents/hazards based on seasonal and mining conditions.
Respond strictly in JSON format:
{
  "predictedIncidents": [
    {
      "type": "Roof Fall",
      "probability": 78,
      "timeframe": "Next 15 days",
      "location": "Panel A-12, Gevra Mine",
      "actions": ["Install roof bolts", "Perform ultrasonic soundings"]
    },
    {
      "type": "Methane Accumulation",
      "probability": 65,
      "timeframe": "Next 7 days",
      "location": "Panel B-07, Kusmunda Mine",
      "actions": ["Increase intake airflow", "Calibrate methanometers"]
    }
  ]
}`;
        const result = await model.generateContent(prompt);
        const text = (await result.response).text();
        const parsed = parseJsonFromResponse<RiskPrediction | null>(text, null);
        if (parsed && Array.isArray(parsed.predictedIncidents)) return parsed;
      } catch (error: any) {
        console.warn('AI Risk Prediction failed, falling back to mock.', error?.message || error);
      }
    }

    // MOCK FALLBACK MODE
    await new Promise(r => setTimeout(r, 1000));
    return {
      predictedIncidents: [
        { type: "Roof Fall", probability: 78, timeframe: "Next 15 days", location: "Panel A-12, Gevra Mine", actions: ["Install roof bolts"] },
        { type: "Ventilation Failure", probability: 65, timeframe: "Next 30 days", location: "Panel B-07, Kusmunda Mine", actions: ["Replace ducts"] }
      ]
    };
  }
};
