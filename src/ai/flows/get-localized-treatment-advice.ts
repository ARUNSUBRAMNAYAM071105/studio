'use server';
/**
 * @fileOverview An AI agent that provides localized treatment advice for crop diseases.
 *
 * - getLocalizedTreatmentAdvice - A function that handles the process of providing localized treatment advice.
 * - GetLocalizedTreatmentAdviceInput - The input type for the getLocalizedTreatmentAdvice function.
 * - GetLocalizedTreatmentAdviceOutput - The return type for the getLocalizedTreatmentAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetLocalizedTreatmentAdviceInputSchema = z.object({
  disease: z.string().describe('The diagnosed disease.'),
  crop: z.string().describe('The affected crop.'),
  region: z.string().describe('The geographic region of the farm.'),
  farmerProfile: z.string().optional().describe('The profile information of the farmer.'),
});
export type GetLocalizedTreatmentAdviceInput = z.infer<
  typeof GetLocalizedTreatmentAdviceInputSchema
>;

const GetLocalizedTreatmentAdviceOutputSchema = z.object({
  treatmentAdvice: z
    .string()
    .describe(
      'Localized treatment options and best practices tailored to the diagnosed disease, crop, and region.'
    ),
});
export type GetLocalizedTreatmentAdviceOutput = z.infer<
  typeof GetLocalizedTreatmentAdviceOutputSchema
>;

export async function getLocalizedTreatmentAdvice(
  input: GetLocalizedTreatmentAdviceInput
): Promise<GetLocalizedTreatmentAdviceOutput> {
  return getLocalizedTreatmentAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getLocalizedTreatmentAdvicePrompt',
  input: {schema: GetLocalizedTreatmentAdviceInputSchema},
  output: {schema: GetLocalizedTreatmentAdviceOutputSchema},
  prompt: `You are an expert agricultural advisor specializing in sustainable and organic farming. You will provide localized treatment advice for crop diseases with a strong emphasis on eco-friendly solutions.

  Based on the identified disease, crop, region, and farmer profile, provide the most effective and sustainable treatment options.

  Disease: {{{disease}}}
  Crop: {{{crop}}}
  Region: {{{region}}}
  Farmer Profile: {{{farmerProfile}}}

  Provide detailed, actionable advice. Prioritize organic, biological, and cultural methods (like neem oil, bio-pesticides, composting, crop rotation). 
  Only recommend low-chemical treatments as a last resort. 
  Highlight solutions that are locally available and government-approved if possible.
  Be as concise as possible while still being thorough.
  `,
});

const getLocalizedTreatmentAdviceFlow = ai.defineFlow(
  {
    name: 'getLocalizedTreatmentAdviceFlow',
    inputSchema: GetLocalizedTreatmentAdviceInputSchema,
    outputSchema: GetLocalizedTreatmentAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
