'use server';
/**
 * @fileOverview An AI agent that retrieves cost estimations for crop disease remedies.
 *
 * - getCostEstimation - A function that retrieves remedy costs from Firestore.
 * - GetCostEstimationInput - The input type for the getCostEstimation function.
 * - GetCostEstimationOutput - The return type for the getCostEstimation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getRemedies} from '@/lib/firebase-service';

const GetCostEstimationInputSchema = z.object({
  diseaseName: z.string().describe('The name of the diagnosed disease.'),
  region: z.string().describe('The geographic region of the farm.'),
});
export type GetCostEstimationInput = z.infer<typeof GetCostEstimationInputSchema>;

const RemedySchema = z.object({
    remedyName: z.string(),
    remedyType: z.string(),
    unit: z.string(),
    avgCost: z.number(),
});

const GetCostEstimationOutputSchema = z.object({
  remedies: z
    .array(RemedySchema)
    .describe('A list of recommended remedies with their approximate costs.'),
});
export type GetCostEstimationOutput = z.infer<typeof GetCostEstimationOutputSchema>;

export async function getCostEstimation(
  input: GetCostEstimationInput
): Promise<GetCostEstimationOutput> {
  return getCostEstimationFlow(input);
}

const getCostEstimationFlow = ai.defineFlow(
  {
    name: 'getCostEstimationFlow',
    inputSchema: GetCostEstimationInputSchema,
    outputSchema: GetCostEstimationOutputSchema,
  },
  async ({diseaseName, region}) => {
    try {
      const remedies = await getRemedies(diseaseName, region);
      return { remedies };
    } catch (error) {
      console.error('Error fetching remedies from Firestore:', error);
      // Return an empty array in case of an error to avoid breaking the frontend
      return { remedies: [] };
    }
  }
);
