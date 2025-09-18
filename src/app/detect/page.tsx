"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  UploadCloud,
  Loader2,
  HeartPulse,
  Syringe,
  AlertTriangle,
  Leaf,
  Camera,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import useLocalStorage from "@/hooks/use-local-storage";
import { PageHeader } from "@/components/page-header";
import {
  diagnosePlant,
  DiagnosePlantOutput,
} from "@/ai/flows/repurpose-diagnose-plant-disease";
import {
  getLocalizedTreatmentAdvice,
  GetLocalizedTreatmentAdviceOutput,
} from "@/ai/flows/get-localized-treatment-advice";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const diagnosisSchema = z.object({
  image: z
    .any()
    .refine((files) => files?.length == 1, "Image is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
});

const treatmentSchema = z.object({
  crop: z.string().min(1, "Crop type is required."),
  region: z.string().min(1, "Region is required."),
});

type FarmerProfile = {
  name: string;
  location: string;
  landSize: string;
  crops: string;
};

export default function DiseaseDetectionPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiagnosePlantOutput | null>(null);
  const [treatment, setTreatment] = useState<GetLocalizedTreatmentAdviceOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [isDiagnosing, startDiagnosisTransition] = useTransition();
  const [isTreating, startTreatmentTransition] = useTransition();

  const [profile] = useLocalStorage<FarmerProfile | null>("farmer-profile", null);

  const diagnosisForm = useForm<z.infer<typeof diagnosisSchema>>({
    resolver: zodResolver(diagnosisSchema),
  });

  const treatmentForm = useForm<z.infer<typeof treatmentSchema>>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      crop: profile?.crops?.split(',')[0]?.trim() || "",
      region: profile?.location || "",
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setDiagnosis(null);
        setTreatment(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDiagnosisSubmit: SubmitHandler<z.infer<typeof diagnosisSchema>> = async (data) => {
    if (!preview) return;

    startDiagnosisTransition(async () => {
      try {
        const result = await diagnosePlant({ photoDataUri: preview });
        setDiagnosis(result);
        if (result.diagnosis.isHealthy) {
          toast({
            title: "Healthy Plant!",
            description: "No disease was detected in the image.",
          });
        }
      } catch (e) {
        console.error(e);
        setError("Failed to diagnose the plant. Please try again.");
        toast({
          variant: "destructive",
          title: "Diagnosis Error",
          description: "An unexpected error occurred during diagnosis.",
        });
      }
    });
  };

  const onTreatmentSubmit: SubmitHandler<z.infer<typeof treatmentSchema>> = async (data) => {
    if (!diagnosis || !diagnosis.diagnosis.diagnosis) return;

    startTreatmentTransition(async () => {
      try {
        const farmerProfile = profile ? `Name: ${profile.name}, Land Size: ${profile.landSize}, Location: ${profile.location}, Crops: ${profile.crops}` : undefined;
        const result = await getLocalizedTreatmentAdvice({
          disease: diagnosis.diagnosis.diagnosis,
          crop: data.crop,
          region: data.region,
          farmerProfile: farmerProfile && farmerProfile.length > 20 ? farmerProfile : undefined,
        });
        setTreatment(result);
      } catch (e) {
        console.error(e);
        setError("Failed to get treatment advice. Please try again.");
        toast({
          variant: "destructive",
          title: "Treatment Advice Error",
          description: "An unexpected error occurred while fetching advice.",
        });
      }
    });
  };
  
  const uploadPlaceholder = PlaceHolderImages.find(p => p.id === 'upload-placeholder');
  
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Disease Detection" />
      <main className="flex-1 p-4 lg:p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Scan Your Crop</CardTitle>
            <CardDescription>
              Upload a photo of an affected plant to get an instant AI-powered diagnosis.
            </CardDescription>
          </CardHeader>
          <Form {...diagnosisForm}>
            <form onSubmit={diagnosisForm.handleSubmit(onDiagnosisSubmit)}>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="aspect-video w-full relative overflow-hidden rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/50">
                    {preview ? (
                      <Image
                        src={preview}
                        alt="Plant preview"
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="text-center text-muted-foreground z-10 p-4 flex flex-col items-center">
                          <Camera className="mx-auto h-16 w-16" />
                          <p className="font-semibold mt-4">Take or upload a photo</p>
                          <p className="text-xs mt-1">PNG, JPG, WEBP up to 5MB</p>
                      </div>
                    )}
                  </div>
                   <FormField
                    control={diagnosisForm.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            className="text-lg p-2"
                            onChange={(e) => {
                              field.onChange(e.target.files);
                              handleImageChange(e);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-4">
                  {isDiagnosing && (
                    <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                      <Loader2 className="h-16 w-16 animate-spin text-primary" />
                      <p className="font-semibold text-lg">Analyzing your crop...</p>
                      <p className="text-muted-foreground">
                        Our AI is hard at work. This should only take a moment.
                      </p>
                    </div>
                  )}

                  {!isDiagnosing && diagnosis && (
                    <Card className="flex-1">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline">
                          <HeartPulse />
                          Diagnosis Result
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {!diagnosis.diagnosis.isHealthy ? (
                          <>
                            {preview && <Image src={preview} alt="Analyzed plant" width={600} height={400} className="rounded-md object-cover w-full aspect-video"/>}
                            <div>
                              <Label>Detected Disease</Label>
                              <p className="text-2xl font-bold text-destructive">
                                {diagnosis.diagnosis.diagnosis}
                              </p>
                            </div>
                          </>
                        ) : (
                           <div className="flex flex-col items-center justify-center text-center space-y-2 py-8">
                                <Leaf className="h-12 w-12 text-primary"/>
                                <p className="text-xl font-bold">Plant Appears Healthy</p>
                                <p className="text-muted-foreground">No disease was detected. Keep up the great work!</p>
                           </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {!isDiagnosing && error && (
                    <div className="flex flex-col items-center justify-center h-full space-y-4 text-center text-destructive">
                      <AlertTriangle className="h-16 w-16" />
                      <p className="font-semibold text-lg">Diagnosis Failed</p>
                      <p>{error}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={!preview || isDiagnosing} size="lg" className="w-full md:w-auto text-lg">
                  {isDiagnosing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Diagnosing...
                    </>
                  ) : (
                    "Diagnose Plant"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {diagnosis && !diagnosis.diagnosis.isHealthy && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Syringe /> Get Localized Treatment Advice
              </CardTitle>
              <CardDescription>
                Provide your crop type and region for tailored recommendations.
              </CardDescription>
            </CardHeader>
            <Form {...treatmentForm}>
              <form onSubmit={treatmentForm.handleSubmit(onTreatmentSubmit)}>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={treatmentForm.control}
                    name="crop"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Crop Type</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Tomato, Corn" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={treatmentForm.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Geographic Region</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Central Valley, California" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isTreating} size="lg">
                    {isTreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Advice...
                      </>
                    ) : (
                      "Get Treatment Plan"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        )}

        {isTreating && (
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center h-48 space-y-4 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="font-semibold text-lg">Generating your custom treatment plan...</p>
              <p className="text-muted-foreground">
                We're consulting our digital agronomist.
              </p>
            </CardContent>
          </Card>
        )}

        {treatment && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Recommended Treatment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {treatment.treatmentAdvice.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
