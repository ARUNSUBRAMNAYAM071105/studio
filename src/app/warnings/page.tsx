"use client";

import { useTransition, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Send, ServerCrash, BellRing, BellOff } from "lucide-react";

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
  receiveEarlyDiseaseOutbreakWarnings,
  ReceiveEarlyDiseaseOutbreakWarningsOutput,
} from "@/ai/flows/receive-early-disease-outbreak-warnings";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const warningSchema = z.object({
  region: z.string().min(3, "Region is required."),
  crop: z.string().min(3, "Crop type is required."),
  weatherData: z.string().min(10, "Weather data is required."),
  regionalReports: z.string().min(10, "Regional reports are required."),
  farmerContact: z.string().email("A valid email address is required."),
});

type WarningFormValues = z.infer<typeof warningSchema>;

export default function WarningsPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] =  useState<ReceiveEarlyDiseaseOutbreakWarningsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<WarningFormValues>({
    resolver: zodResolver(warningSchema),
    defaultValues: {
        region: "",
        crop: "",
        weatherData: "",
        regionalReports: "",
        farmerContact: "",
    }
  });

  const onSubmit: SubmitHandler<WarningFormValues> = (data) => {
    startTransition(async () => {
      setResult(null);
      try {
        const response = await receiveEarlyDiseaseOutbreakWarnings(data);
        setResult(response);
        toast({
          title: "Analysis Complete",
          description: "Outbreak risk has been assessed.",
        });
      } catch (e) {
        console.error(e);
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: "An unexpected error occurred. Please try again.",
        });
      }
    });
  };

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Early Warning System" />
      <main className="flex-1 p-4 lg:p-6 space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
            <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle className="font-headline">Check for Outbreak Risks</CardTitle>
                    <CardDescription>
                    Enter regional data to get an AI-powered risk assessment for disease outbreaks.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="region"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Geographic Region</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Western Kenya" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="crop"
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
                    </div>
                     <FormField
                        control={form.control}
                        name="weatherData"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Current Weather Data</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Paste current weather data: temperature, humidity, rainfall..." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="regionalReports"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Recent Regional Reports</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Paste recent disease reports from local sources..." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="farmerContact"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Farmer Email for Alert</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="e.g., farmer@example.com" {...field} />
                            </FormControl>
                            <FormDescription>An email will be simulated for this address.</FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isPending}>
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 animate-spin" /> Analyzing...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2" /> Assess Risk
                        </>
                    )}
                    </Button>
                </CardFooter>
                </form>
            </Form>
            </Card>

            <div className="flex items-center justify-center">
                {isPending && (
                     <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                        <Loader2 className="h-16 w-16 animate-spin text-primary" />
                        <p className="font-semibold text-lg">Assessing Outbreak Risk...</p>
                        <p className="text-muted-foreground">
                            Analyzing data streams to protect your crops.
                        </p>
                    </div>
                )}
                {!isPending && result && (
                    <Alert variant={result.alertSent ? "destructive" : "default"} className="w-full">
                         {result.alertSent ? <BellRing className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                        <AlertTitle className="font-headline">{result.alertSent ? "High Risk Detected - Alert Sent!" : "Low Risk - No Alert Needed"}</AlertTitle>
                        <AlertDescription>
                           {result.alertSent ? result.message : "Our analysis shows no immediate threat of a disease outbreak for the specified crop and region. Continue standard monitoring."}
                        </AlertDescription>
                    </Alert>
                )}
                 {!isPending && !result && (
                     <Card className="w-full h-full flex flex-col items-center justify-center bg-muted/50 border-2 border-dashed">
                        <ServerCrash className="h-16 w-16 text-muted-foreground" />
                        <p className="text-muted-foreground mt-4 text-center">Results will be displayed here.</p>
                     </Card>
                )}
            </div>
        </div>
      </main>
    </div>
  );
}
