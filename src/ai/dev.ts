'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/repurpose-diagnose-plant-disease.ts';
import '@/ai/flows/get-localized-treatment-advice.ts';
import '@/ai/flows/receive-early-disease-outbreak-warnings.ts';
import '@/ai/flows/chatbot-advisor.ts';
import '@/ai/flows/predict-harvest-yield.ts';
import '@/ai/flows/get-cost-estimation.ts';
    
