
"use client";

import { useTransition, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  DollarSign,
  AlertTriangle,
  Send,
  Bot,
} from "lucide-react";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import useLocalStorage from "@/hooks/use-local-storage";
import { PageHeader } from "@/components/page-header";
import {
  getCostEstimation,
  GetCostEstimationOutput,
} from "@/ai/flows/get-cost-estimation";

const costSchema = z.object({
  disease: z.string().min(3, "Disease is required."),
  region: z.string().min(3, "Region is required."),
});

type CostFormValues = z.infer<typeof costSchema>;

type FarmerProfile = {
  name: string;
  location: string;
  landSize: string;
  crops: string;
};

export default function CostEstimatorPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<GetCostEstimationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [profile] = useLocalStorage<FarmerProfile | null>("farmer-profile", null);

  const form = useForm<CostFormValues>({
    resolver: zodResolver(costSchema),
    defaultValues: {
      disease: "",
      region: profile?.location || "",
    },
  });

  const onSubmit: SubmitHandler<CostFormValues> = (data) => {
    startTransition(async () => {
      setResult(null);
      setError(null);
      try {
        const response = await getCostEstimation(data);
        setResult(response);
        toast({
          title: "Estimation Complete",
          description: "Remedy costs have been fetched.",
        });
      } catch (e) {
        console.error(e);
        setError("Failed to get cost estimation. Please try again.");
        toast({
          variant: "destructive",
          title: "Estimation Failed",
          description: "An unexpected error occurred. Please try again.",
        });
      }
    });
  };

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Remedy Cost Estimator" />
      <main className="flex-1 p-4 lg:p-6 space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                  <CardTitle className="font-headline">
                    Get Remedy Cost Estimates
                  </CardTitle>
                  <CardDescription>
                    Enter a disease and region to find estimated costs for
                    treatments.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="disease"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Disease</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Late Blight" {...field} />
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
                            placeholder="e.g., Central Valley, California"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 animate-spin" /> Estimating...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2" /> Get Estimates
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
                    Fetching Cost Data...
                  </p>
                  <p className="text-muted-foreground">
                    Our AI is checking local prices for you. This might take a moment.
                  </p>
                </div>
              </Card>
            )}

            {!isPending && !result && (
              <Card className="w-full h-full flex flex-col items-center justify-center bg-muted/50 border-2 border-dashed">
                <Bot className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground mt-4 text-center">
                  Your cost estimates will appear here.
                </p>
              </Card>
            )}
            
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2">
                    <DollarSign /> Remedy Cost Estimator
                  </CardTitle>
                  <CardDescription>
                    Estimated costs for remedies in your region. Prices may vary.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {result.remedies && result.remedies.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Remedy</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">
                            Estimated Cost
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.remedies.map((remedy, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {remedy.remedyName}
                            </TableCell>
                            <TableCell>{remedy.remedyType}</TableCell>
                            <TableCell className="text-right font-mono">
                              ₹{remedy.avgCost.toFixed(2)} / {remedy.unit}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>No Cost Data Found</AlertTitle>
                      <AlertDescription>
                        We couldn't find any cost estimations for this disease in your specified region. 
                        This may be because our database does not yet have pricing for your area, or the remedy data has not been added to your Firestore 'remedies' collection.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            {error && (
               <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {error}
                  </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
