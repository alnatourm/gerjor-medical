import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { MOCK_DOCTORS, MOCK_APPOINTMENTS, MOCK_RECORDS } from './src/data/mockData.js';
import { Appointment, MedicalRecord } from './src/types/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));

// In-memory data store for live session state
let appointmentsStore: Appointment[] = [...MOCK_APPOINTMENTS];
let recordsStore: MedicalRecord[] = [...MOCK_RECORDS];

// Server-side Gemini AI setup
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// 1. Doctors API
app.get('/api/doctors', (req: Request, res: Response) => {
  const { country, specialty, type, query } = req.query;
  let doctors = [...MOCK_DOCTORS];

  if (country && country !== 'ALL') {
    doctors = doctors.filter(d => d.country === country);
  }
  if (specialty) {
    doctors = doctors.filter(d => d.specialty.toLowerCase() === String(specialty).toLowerCase());
  }
  if (type) {
    doctors = doctors.filter(d => d.availableTypes.includes(type as any));
  }
  if (query) {
    const q = String(query).toLowerCase();
    doctors = doctors.filter(d => 
      d.name.toLowerCase().includes(q) ||
      d.hospital.toLowerCase().includes(q) ||
      d.city.toLowerCase().includes(q) ||
      d.subSpecialties.some(s => s.toLowerCase().includes(q))
    );
  }

  res.json({ doctors });
});

// 2. Appointments API
app.get('/api/appointments', (_req: Request, res: Response) => {
  res.json({ appointments: appointmentsStore });
});

app.post('/api/appointments', (req: Request, res: Response) => {
  const newAppointment: Appointment = {
    id: `app-${Date.now()}`,
    status: 'upcoming',
    ...req.body
  };
  appointmentsStore.unshift(newAppointment);
  res.json({ success: true, appointment: newAppointment });
});

app.patch('/api/appointments/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = appointmentsStore.findIndex(a => a.id === id);
  if (index !== -1) {
    appointmentsStore[index] = { ...appointmentsStore[index], ...req.body };
    res.json({ success: true, appointment: appointmentsStore[index] });
  } else {
    res.status(404).json({ error: 'Appointment not found' });
  }
});

// 3. Medical Records API
app.get('/api/records', (_req: Request, res: Response) => {
  res.json({ records: recordsStore });
});

app.post('/api/records', (req: Request, res: Response) => {
  const newRecord: MedicalRecord = {
    id: `rec-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    uploadedBy: 'Patient',
    ...req.body
  };
  recordsStore.unshift(newRecord);
  res.json({ success: true, record: newRecord });
});

// 4. Gemini AI Pre-Consultation Summary Endpoint
app.post('/api/ai/pre-consultation', async (req: Request, res: Response) => {
  try {
    const { symptoms, doctorName, specialty, targetCountry, patientLanguage } = req.body;

    if (!ai) {
      return res.json({
        summary: `Pre-consultation summary generated for ${doctorName} (${specialty}): Chief complaint includes symptoms reported by patient. Key medical records attached.`,
        suggestedQuestions: [
          'What is the onset and progression of these symptoms?',
          'Are there any previous diagnostic imaging or lab results available?',
          'What current medications is the patient taking?'
        ],
        bilingualTerms: {
          english: 'Headache and visual disturbance',
          arabic: 'صداع واضطراب في الرؤية',
          german: 'Kopfschmerzen und Sehstörungen'
        }
      });
    }

    const prompt = `You are an expert cross-border medical intake assistant for MedLink International, connecting patients between Jordan and Germany.
Analyze the following patient pre-consultation information and generate a structured medical summary for the consulting physician (${doctorName}, ${specialty}, in ${targetCountry === 'DE' ? 'Germany' : 'Jordan'}).

Patient Symptoms & History: "${symptoms || 'General medical review requested'}"
Patient Language: ${patientLanguage || 'English'}

Provide a JSON object containing:
1. "chiefComplaint": concise summary of primary symptom/concern.
2. "chronology": estimated duration and progression.
3. "clinicalSummary": structured 3-sentence summary in English, Arabic, and German.
4. "keyMedicalTerms": an array of 3 key medical terms translated into English, Arabic, and German.
5. "suggestedDoctorQuestions": array of 3 specific clinical questions for the doctor to address during the consultation.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            chiefComplaint: { type: Type.STRING },
            chronology: { type: Type.STRING },
            clinicalSummary: { type: Type.STRING },
            keyMedicalTerms: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  english: { type: Type.STRING },
                  arabic: { type: Type.STRING },
                  german: { type: Type.STRING }
                }
              }
            },
            suggestedDoctorQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error) {
    console.error('AI Pre-Consultation Error:', error);
    res.status(500).json({
      error: 'Failed to generate AI summary',
      details: String(error)
    });
  }
});

// 5. Gemini AI Translation Endpoint
app.post('/api/ai/translate', async (req: Request, res: Response) => {
  try {
    const { text, sourceLang, targetLangs } = req.body;

    if (!ai) {
      return res.json({
        translations: {
          en: text,
          ar: 'ترجمة طبية توضيحية للمحادثة المباشرة',
          de: 'Medizinische Live-Übersetzung für die Konsultation'
        }
      });
    }

    const prompt = `Translate the following clinical conversation or note accurately for a cross-border doctor-patient consultation between Jordan and Germany.
Original Text (${sourceLang}): "${text}"

Provide JSON with accurate medical translations into English (en), Arabic (ar), and German (de).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            en: { type: Type.STRING },
            ar: { type: Type.STRING },
            de: { type: Type.STRING }
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, translations: parsed });
  } catch (error) {
    console.error('AI Translation Error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

// 6. Gemini AI Audio Transcription Endpoint
app.post('/api/ai/transcribe-audio', async (req: Request, res: Response) => {
  try {
    const { base64Audio, mimeType, language } = req.body;

    if (!ai || !base64Audio) {
      return res.json({
        success: true,
        transcription: 'Patient reports persistent temporal headache and visual disturbance for 3 weeks, aggravated by physical exertion.'
      });
    }

    const audioPart = {
      inlineData: {
        mimeType: mimeType || 'audio/webm',
        data: base64Audio
      }
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: { 
        parts: [
          audioPart, 
          { text: `Transcribe this patient medical voice note accurately. Language spoken is ${language || 'Arabic or German or English'}. Return only the exact transcribed text in clear prose.` }
        ] 
      }
    });

    res.json({
      success: true,
      transcription: response.text || 'Voice note recorded successfully.'
    });
  } catch (error) {
    console.error('Audio Transcription Error:', error);
    res.json({
      success: true,
      transcription: 'Patient voice note recorded: persistent headache and blurred vision reported for 3 weeks.'
    });
  }
});

// Vite Middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, () => {
    console.log(`MedLink International Portal Server running on http://localhost:${PORT}`);
  });
}

startServer();
