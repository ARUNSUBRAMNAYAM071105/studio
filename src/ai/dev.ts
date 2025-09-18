import { config } from 'dotenv';
config();

import '@/ai/flows/repurpose-diagnose-plant-disease.ts';
import '@/ai/flows/get-localized-treatment-advice.ts';
import '@/ai/flows/receive-early-disease-outbreak-warnings.ts';
    