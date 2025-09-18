'use server';

/**
 * @fileOverview A flow for sending early warning alerts to farmers about potential disease outbreaks.
 *
 * - receiveEarlyDiseaseOutbreakWarnings - A function that sends email alerts to farmers based on predicted disease outbreaks.
 * - ReceiveEarlyDiseaseOutbreakWarningsInput - The input type for the receiveEarlyDiseaseOutbreakWarnings function.
 * - ReceiveEarlyDiseaseOutbreakWarningsOutput - The return type for the receiveEarlyDiseaseOutbreakWarnings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReceiveEarlyDiseaseOutbreakWarningsInputSchema = z.object({
  region: z.string().describe('The geographic region to check for outbreaks.'),
  crop: z.string().describe('The crop type to check for potential diseases.'),
  weatherData: z.string().describe('The current weather data for the region.'),
  regionalReports: z.string().describe('Recent regional disease reports.'),
});
export type ReceiveEarlyDiseaseOutbreakWarningsInput = z.infer<typeof ReceiveEarlyDiseaseOutbreakWarningsInputSchema>;

const ReceiveEarlyDiseaseOutbreakWarningsOutputSchema = z.object({
  alertSent: z.boolean().describe('Whether an alert was sent to the farmer.'),
  message: z.string().describe('The content of the alert message sent to the farmer, if any.'),
});
export type ReceiveEarlyDiseaseOutbreakWarningsOutput = z.infer<typeof ReceiveEarlyDiseaseOutbreakWarningsOutputSchema>;

export async function receiveEarlyDiseaseOutbreakWarnings(input: ReceiveEarlyDiseaseOutbreakWarningsInput): Promise<ReceiveEarlyDiseaseOutbreakWarningsOutput> {
  return receiveEarlyDiseaseOutbreakWarningsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'receiveEarlyDiseaseOutbreakWarningsPrompt',
  input: {
    schema: ReceiveEarlyDiseaseOutbreakWarningsInputSchema,
  },
  output: {
    schema: ReceiveEarlyDiseaseOutbreakWarningsOutputSchema,
  },
  prompt: `You are an AI assistant that analyzes weather data, regional reports, and crop information to predict disease outbreaks and generate alerts.

  Region: {{{region}}}
  Crop: {{{crop}}}
  Weather Data: {{{weatherData}}}
  Regional Reports: {{{regionalReports}}}

  Analyze the provided data and determine if there is a significant risk of a disease outbreak for the specified crop in the given region. If there is a risk, generate a concise alert message warning about the potential outbreak and suggest proactive measures. If there is no significant risk, indicate that no alert is necessary.

  Respond with JSON format:
  {
    "alertSent": true/false,  // true if an alert was generated, false otherwise
    "message": "The alert message. If no alert is necessary, this is an empty string."
  }`,
});

const receiveEarlyDiseaseOutbreakWarningsFlow = ai.defineFlow(
  {
    name: 'receiveEarlyDiseaseOutbreakWarningsFlow',
    inputSchema: ReceiveEarlyDiseaseOutbreakWarningsInputSchema,
    outputSchema: ReceiveEarlyDiseaseOutbreakWarningsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
