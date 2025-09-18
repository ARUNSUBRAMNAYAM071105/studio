'use server';
/**
 * @fileOverview An AI agent that predicts harvest yield and potential market price.
 *
 * - predictHarvestYield - A function that handles the harvest prediction process.
 * - PredictHarvestYieldInput - The input type for the predictHarvestYield function.
 * - PredictHarvestYieldOutput - The return type for the predictHarvestYield function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictHarvestYieldInputSchema = z.object({
  cropType: z.string().describe('The type of crop being grown.'),
  cropHealth: z
    .string()
    .describe(
      'The current health status of the crop (e.g., Healthy, Early blight, etc.).'
    ),
  landSize: z.string().describe('The size of the cultivated land (e.g., 5 Acres).'),
  region: z.string().describe('The geographic region of the farm.'),
  historicalData: z
    .string()
    .optional()
    .describe(
      'Historical data about past yields, weather, etc. (e.g., "Last year yield was 10 tons with normal rain.")'
    ),
});
export type PredictHarvestYieldInput = z.infer<typeof PredictHarvestYieldInputSchema>;

const PredictHarvestYieldOutputSchema = z.object({
  estimatedYield: z
    .string()
    .describe(
      'The estimated harvest yield (e.g., "10-12 tons"). Include units.'
    ),
  potentialMarketPrice: z
    .string()
    .describe(
      'The potential market price range in Indian Rupees (e.g., "₹200 - ₹250 per ton"). Include currency and units.'
    ),
  confidenceScore: z
    .number()
    .min(0)
    .max(1)
    .describe('The confidence score of the prediction, between 0 and 1.'),
  recommendations: z
    .string()
    .describe(
      'A brief set of recommendations to improve yield or market position.'
    ),
});
export type PredictHarvestYieldOutput = z.infer<
  typeof PredictHarvestYieldOutputSchema
>;

export async function predictHarvestYield(
  input: PredictHarvestYieldInput
): Promise<PredictHarvestYieldOutput> {
  return predictHarvestYieldFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictHarvestYieldPrompt',
  input: {schema: PredictHarvestYieldInputSchema},
  output: {schema: PredictHarvestYieldOutputSchema},
  prompt: `You are an expert agricultural economist and agronomist. Your task is to predict the harvest yield and potential market price for a farmer based on the data they provide.

Analyze the following information:
- Crop Type: {{{cropType}}}
- Crop Health: {{{cropHealth}}}
- Land Size: {{{landSize}}}
- Region: {{{region}}}
- Historical Data: {{{historicalData}}}

Based on this, provide a realistic estimation for the following:
1.  **Estimated Yield**: Predict the total expected harvest volume.
2.  **Potential Market Price**: Estimate the likely price range in the specified region's market in Indian Rupees (₹).
3.  **Confidence Score**: Provide a confidence level (0.0 to 1.0) for your prediction.
4.  **Recommendations**: Offer brief, actionable advice to help the farmer improve their outcome.

Your analysis should consider how crop health impacts yield, and how regional market trends affect pricing. Use the historical data to refine your estimates if provided.
`,
});

const predictHarvestYieldFlow = ai.defineFlow(
  {
    name: 'predictHarvestYieldFlow',
    inputSchema: PredictHarvestYieldInputSchema,
    outputSchema: PredictHarvestYieldOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
