"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save } from "lucide-react";

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
import useLocalStorage from "@/hooks/use-local-storage";
import { PageHeader } from "@/components/page-header";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  location: z.string().min(2, "Location is required."),
  landSize: z.string().optional(),
  crops: z.string().min(2, "Please list at least one crop."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [profile, setProfile] = useLocalStorage<ProfileFormValues>("farmer-profile", {
    name: "",
    location: "",
    landSize: "",
    crops: "",
  });

  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile,
  });
  
  // Keep form in sync with localStorage if it changes in another tab
  form.reset(profile);

  const onSubmit: SubmitHandler<ProfileFormValues> = (data) => {
    setProfile(data);
    toast({
      title: "Profile Saved",
      description: "Your information has been successfully updated.",
    });
  };

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="My Profile" />
      <main className="flex-1 p-4 lg:p-6">
        <Card className="max-w-2xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle className="font-headline">Farmer Information</CardTitle>
                <CardDescription>
                  This information helps us provide more personalized advice. It is saved securely on your device.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Farm Location / Region</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Rift Valley, Kenya" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  name="crops"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Crops Grown</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Maize, Beans, Tomatoes"
                          {...field}
                        />
                      </FormControl>
                       <FormDescription>
                        Please separate crop names with commas.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit">
                  <Save className="mr-2" />
                  Save Profile
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </main>
    </div>
  );
}
