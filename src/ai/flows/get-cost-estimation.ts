'use server';
/**
 * @fileOverview An AI agent that provides cost estimation for crop disease remedies.
 *
 * - getCostEstimation - A function that fetches estimated costs for remedies from Firestore.
 * - GetCostEstimationInput - The input type for the getCostEstimation function.
 * - GetCostEstimationOutput - The return type for the getCostEstimation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getRemedies} from '@/lib/firebase-service';

const RemedySchema = z.object({
  remedyName: z.string().describe('The name of the remedy.'),
  remedyType: z.string().describe('The type of remedy (e.g., chemical, organic).'),
  avgCost: z.number().describe('The average cost of the remedy.'),
  unit: z.string().describe('The unit of measurement for the cost (e.g., per liter, per kg).'),
});

const GetCostEstimationInputSchema = z.object({
  disease: z.string().describe('The diagnosed disease.'),
  region: z.string().describe('The geographic region of the farm.'),
});
export type GetCostEstimationInput = z.infer<typeof GetCostEstimationInputSchema>;

const GetCostEstimationOutputSchema = z.object({
  remedies: z
    .array(RemedySchema)
    .describe('A list of recommended remedies with their estimated costs.'),
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
  async ({disease, region}) => {
    try {
      const remedies = await getRemedies(disease, region);
      
      if (!remedies || remedies.length === 0) {
        return { remedies: [] };
      }

      return { remedies };
    } catch (error) {
      console.error("Error fetching remedies from Firestore:", error);
      // Return an empty array in case of an error to prevent the app from crashing.
      return { remedies: [] };
    }
  }
);
