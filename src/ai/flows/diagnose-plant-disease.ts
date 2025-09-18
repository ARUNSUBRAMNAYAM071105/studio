'use server';

/**
 * @fileOverview A plant disease diagnosis AI agent.
 *
 * - diagnosePlantDisease - A function that handles the plant disease diagnosis process.
 * - DiagnosePlantDiseaseInput - The input type for the diagnosePlantDisease function.
 * - DiagnosePlantDiseaseOutput - The return type for the diagnosePlantDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnosePlantDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DiagnosePlantDiseaseInput = z.infer<typeof DiagnosePlantDiseaseInputSchema>;

const DiagnosePlantDiseaseOutputSchema = z.object({
  diseaseName: z.string().describe('The name of the identified disease, if any.'),
  confidenceScore: z
    .number()
    .describe(
      'The confidence score of the diagnosis, between 0 and 1.  If no disease is present, the confidence score should be 0.'
    ),
});
export type DiagnosePlantDiseaseOutput = z.infer<typeof DiagnosePlantDiseaseOutputSchema>;

export async function diagnosePlantDisease(input: DiagnosePlantDiseaseInput): Promise<DiagnosePlantDiseaseOutput> {
  return diagnosePlantDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnosePlantDiseasePrompt',
  input: {schema: DiagnosePlantDiseaseInputSchema},
  output: {schema: DiagnosePlantDiseaseOutputSchema},
  prompt: `You are an expert in plant pathology.  A farmer will provide you with a photo of a plant, and you will respond with the name of the disease present in the photo, and a confidence score between 0 and 1.

If no disease is present, you should respond with a confidence score of 0 and leave the disease name blank.

Here is the photo provided by the farmer: {{media url=photoDataUri}}`,
});

const diagnosePlantDiseaseFlow = ai.defineFlow(
  {
    name: 'diagnosePlantDiseaseFlow',
    inputSchema: DiagnosePlantDiseaseInputSchema,
    outputSchema: DiagnosePlantDiseaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
