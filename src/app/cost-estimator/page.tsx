
"use client";

import { useTransition, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, CircleDollarSign, Bot, AlertTriangle, Database } from "lucide-react";

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/page-header";
import {
  getCostEstimation,
  GetCostEstimationOutput,
} from "@/ai/flows/get-cost-estimation";
import useLocalStorage from "@/hooks/use-local-storage";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const costEstimatorSchema = z.object({
  diseaseName: z.string().min(3, "Disease name is required."),
  region: z.string().min(2, "Region is required."),
});

type CostEstimatorFormValues = z.infer<typeof costEstimatorSchema>;

type FarmerProfile = {
  location?: string;
};

export default function CostEstimatorPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<GetCostEstimationOutput | null>(null);
  const { toast } = useToast();
  const [profile] = useLocalStorage<FarmerProfile | null>("farmer-profile", null);
  const [error, setError] = useState<string | null>(null);


  const form = useForm<CostEstimatorFormValues>({
    resolver: zodResolver(costEstimatorSchema),
    defaultValues: {
      diseaseName: "",
      region: profile?.location || "",
    },
  });

  const onSubmit: SubmitHandler<CostEstimatorFormValues> = (data) => {
    startTransition(async () => {
      setResult(null);
      setError(null);
      try {
        const response = await getCostEstimation(data);
        setResult(response);
        if(response.remedies.length === 0) {
             toast({
                variant: "default",
                title: "No Data Found",
                description: "We couldn't find any remedy cost data for the specified disease and region.",
            });
        } else {
            toast({
                title: "Estimation Complete",
                description: "Remedy costs have been retrieved.",
            });
        }
      } catch (e) {
        console.error(e);
        const errorMessage = "An unexpected error occurred while fetching cost estimations. Please try again later."
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Estimation Failed",
          description: errorMessage,
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
                    Estimate Remedy Costs
                  </CardTitle>
                  <CardDescription>
                    Enter a disease and region to get approximate costs for treatment options from your Firestore database.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="diseaseName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Disease Name</FormLabel>
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
                  <Button type="submit" disabled={isPending} size="lg">
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 animate-spin" /> Estimating...
                      </>
                    ) : (
                      <>
                        <CircleDollarSign className="mr-2" /> Get Estimates
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
                    Fetching local remedy prices...
                  </p>
                  <p className="text-muted-foreground">
                    This might take a moment.
                  </p>
                </div>
              </Card>
            )}
            
            {!isPending && !result && !error && (
              <Card className="w-full h-full flex flex-col items-center justify-center bg-muted/50 border-2 border-dashed">
                <Bot className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground mt-4 text-center">
                  Your cost estimates will appear here.
                </p>
              </Card>
            )}

             {!isPending && error && (
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center justify-center h-full space-y-4 text-center text-destructive">
                            <AlertTriangle className="h-16 w-16" />
                            <p className="font-semibold text-lg">Couldn't Retrieve Details</p>
                            <p>{error}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {result && result.remedies.length > 0 && (
               <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Estimated Remedy Costs</CardTitle>
                        <CardDescription>
                            Approximate costs for remedies in the specified region. Prices may vary.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Remedy</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">Est. Cost</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {result.remedies.map((remedy, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{remedy.remedyName}</TableCell>
                                        <TableCell>{remedy.remedyType}</TableCell>
                                        <TableCell className="text-right">~${remedy.avgCost.toFixed(2)} per {remedy.unit}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
             {result && result.remedies.length === 0 && !isPending && (
                <Alert>
                    <Database className="h-4 w-4"/>
                    <AlertTitle className="font-headline">No Remedy Data Found in Firestore</AlertTitle>
                    <AlertDescription>
                        <p>The cost estimator could not find any matching remedies in your Firestore database for the specified disease and region.</p>
                        <p className="mt-2">To use this feature, please ensure you have a Firestore collection named <strong>`remedies`</strong> with documents containing fields like `diseaseName`, `remedyName`, `region`, `avgCost`, etc.</p>
                        <p className="mt-2">You can add remedies for a specific region or use "Global" as the region for remedies that apply everywhere. A `sample-remedies.json` file has been added to your project to help you get started.</p>
                    </AlertDescription>
                </Alert>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
