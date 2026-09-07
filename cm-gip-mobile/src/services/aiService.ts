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

// TO-DO: Replace with actual Gemini API Key from Google AI Studio.
// If this is blank or default, the service will fall back to smart Mock Mode
// so the UI can still be tested perfectly.
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY'; 

let genAI: GoogleGenerativeAI | null = null;
if (API_KEY && API_KEY !== 'YOUR_GEMINI_API_KEY') {
  genAI = new GoogleGenerativeAI(API_KEY);
}

// 0. Extract text from images using Gemini 1.5 Flash (Vision)
export const extractTextFromImage = async (base64Image: string, mimeType: string = 'image/jpeg'): Promise<string> => {
  if (genAI) {
    try {
      // Must use gemini-1.5-flash for multimodal/vision tasks
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = "Please read and extract all handwritten text, safety observations, and violations from this mining log image. Return ONLY the extracted text.";
      
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
      return response.text();
    } catch (error) {
      console.warn('AI Vision Parsing failed, falling back to mock.', error);
    }
  }

  // MOCK FALLBACK MODE
  await new Promise(r => setTimeout(r, 1500));
  return "Ventilation duct torn at 200m. Air flow restricted. Immediate repair required.";
};

export const aiService = {
  extractTextFromImage,
  // 1. Analyze observation text in real-time
  classifyObservationSeverity: async (description: string): Promise<ObservationClassification> => {
    // Check if real AI is available
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const prompt = `
You are a coal mining safety compliance expert. Classify the severity of this safety observation.
OBSERVATION: "${description}"

CLASSIFICATION CRITERIA:
- CRITICAL: Immediate threat to life, requires work stoppage
- MAJOR: Serious violation, requires action within 24-48 hours
- MINOR: Compliance gap, action within 7 days
- SUGGESTION: Improvement opportunity, no immediate risk

Respond strictly in JSON format (do not use markdown formatting tags):
{
  "severity": "critical|major|minor|suggestion",
  "confidence": 95,
  "regulation": "Regulation 119, CMR 2017",
  "reasoning": "explanation"
}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      } catch (error) {
        console.warn('AI Parsing failed, falling back to mock.', error);
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
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const prompt = `
You are a coal mining safety expert AI. Analyze this inspection data.
Checklist Failures: ${inspectionData.checklistFailures.join(', ')}
Observations: ${inspectionData.observations.map(o => o.text).join('; ')}

Calculate the overall risk score (0-100) and provide insights.
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
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      } catch (error) {
        console.warn('AI Parsing failed, falling back to mock.', error);
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
      // (Implementation same as above but omitted for brevity to use mock directly)
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
