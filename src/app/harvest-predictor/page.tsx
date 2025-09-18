"use client";

import { useTransition, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, TrendingUp, BarChart, Lightbulb, Bot } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/page-header";
import {
  predictHarvestYield,
  PredictHarvestYieldOutput,
} from "@/ai/flows/predict-harvest-yield";
import useLocalStorage from "@/hooks/use-local-storage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const predictorSchema = z.object({
  cropType: z.string().min(2, "Crop type is required."),
  cropHealth: z.string().min(2, "Crop health status is required."),
  landSize: z.string().min(2, "Land size is required."),
  region: z.string().min(2, "Region is required."),
  historicalData: z.string().optional(),
});

type PredictorFormValues = z.infer<typeof predictorSchema>;

type FarmerProfile = {
  name: string;
  location: string;
  landSize: string;
  crops: string;
};

export default function HarvestPredictorPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<PredictHarvestYieldOutput | null>(null);
  const { toast } = useToast();
  const [profile] = useLocalStorage<FarmerProfile | null>("farmer-profile", null);

  const form = useForm<PredictorFormValues>({
    resolver: zodResolver(predictorSchema),
    defaultValues: {
      cropType: profile?.crops?.split(',')[0]?.trim() || "",
      cropHealth: "Healthy",
      landSize: profile?.landSize || "",
      region: profile?.location || "",
      historicalData: "",
    },
  });

  const onSubmit: SubmitHandler<PredictorFormValues> = (data) => {
    startTransition(async () => {
      setResult(null);
      try {
        const response = await predictHarvestYield(data);
        setResult(response);
        toast({
          title: "Prediction Complete",
          description: "Your harvest estimate is ready.",
        });
      } catch (e) {
        console.error(e);
        toast({
          variant: "destructive",
          title: "Prediction Failed",
          description: "An unexpected error occurred. Please try again.",
        });
      }
    });
  };

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Harvest Predictor" />
      <main className="flex-1 p-4 lg:p-6 space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                  <CardTitle className="font-headline">
                    Estimate Your Harvest
                  </CardTitle>
                  <CardDescription>
                    Fill in the details below to get an AI-powered harvest yield
                    and price prediction.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cropType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Crop Type</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Maize" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cropHealth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Crop Health</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Healthy" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                   <div className="grid sm:grid-cols-2 gap-4">
                     <FormField
                      control={form.control}
                      name="landSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Land Size</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 5 Acres" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Geographic Region</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Rift Valley, Kenya"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="historicalData"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Historical Data (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., Last year's yield was 10 tons. Heavy rains in April."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Providing more details can improve prediction accuracy.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isPending} size="lg">
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 animate-spin" /> Predicting...
                      </>
                    ) : (
                      <>
                        <BarChart className="mr-2" /> Predict Harvest
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
          
          <div className="flex flex-col gap-6">
            {isPending && (
              <Card className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center justify-center h-full space-y-4 text-center p-8">
                  <Loader2 className="h-16 w-16 animate-spin text-primary" />
                  <p className="font-semibold text-lg">
                    Calculating Your Potential Harvest...
                  </p>
                  <p className="text-muted-foreground">
                    Our AI is analyzing your data. This might take a moment.
                  </p>
                </div>
              </Card>
            )}

            {!isPending && !result && (
              <Card className="w-full h-full flex flex-col items-center justify-center bg-muted/50 border-2 border-dashed">
                <Bot className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground mt-4 text-center">
                  Your prediction results will appear here.
                </p>
              </Card>
            )}

            {result && (
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="font-headline">
                    Prediction Results
                  </CardTitle>
                  <CardDescription>
                    Confidence Score: {(result.confidenceScore * 100).toFixed(0)}%
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                        <Card className="p-4">
                             <CardHeader className="p-2">
                                <CardTitle className="flex items-center justify-center gap-2 text-lg font-semibold"><BarChart className="text-primary"/> Estimated Yield</CardTitle>
                             </CardHeader>
                             <CardContent className="p-2">
                                <p className="text-3xl font-bold">{result.estimatedYield}</p>
                            </CardContent>
                        </Card>
                        <Card className="p-4">
                            <CardHeader className="p-2">
                                <CardTitle className="flex items-center justify-center gap-2 text-lg font-semibold"><TrendingUp className="text-primary"/> Market Price</CardTitle>
                             </CardHeader>
                             <CardContent className="p-2">
                                <p className="text-3xl font-bold">{result.potentialMarketPrice}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertTitle className="font-headline">AI Recommendations</AlertTitle>
                        <AlertDescription>
                            {result.recommendations}
                        </AlertDescription>
                    </Alert>

                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
