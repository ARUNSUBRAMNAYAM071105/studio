"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Leaf, Map, Bell } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center bg-hero-gradient">
          <Image
            src="https://picsum.photos/seed/farmer-field/1800/1000"
            alt="Farmer in a field"
            fill
            className="object-cover opacity-20"
            data-ai-hint="farmer field"
          />
          <div className="relative z-10 p-4 space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-primary">
              Protect Your Crops, Secure Your Harvest
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
              AI-powered disease detection and management for smallholder farmers.
            </p>
            <Button asChild size="lg" className="text-lg py-6 px-8">
              <Link href="/detect">
                Scan Your Crop Now <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Explanation Cards Section */}
        <section className="py-12 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 rounded-full p-4 w-20 h-20 flex items-center justify-center">
                    <Leaf className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-2xl mt-4">Detect Disease</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Upload a photo of your crop to instantly identify diseases with AI-driven accuracy.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 rounded-full p-4 w-20 h-20 flex items-center justify-center">
                    <Map className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-2xl mt-4">Get Local Guidance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Receive tailored remedies and eco-friendly tips based on your region and crop type.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 rounded-full p-4 w-20 h-20 flex items-center justify-center">
                    <Bell className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-2xl mt-4">Stay Updated</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get timely weather forecasts and pest alerts to protect your farm proactively.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary border-t">
        <div className="container mx-auto py-8 px-4 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <div className="text-center md:text-left">
                <p>Contact Us: help@cropsafe.ai | Helpline: +1-800-FARM-AID</p>
                <p>&copy; {new Date().getFullYear()} CropSafe AI. All Rights Reserved.</p>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
                <Link href="/resources" className="hover:text-primary">Resources</Link>
                <select className="bg-background border border-border rounded-md px-2 py-1">
                    <option>English</option>
                    <option>Swahili</option>
                    <option>Hindi</option>
                </select>
            </div>
        </div>
      </footer>
    </div>
  );
}
