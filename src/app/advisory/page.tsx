"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Video, Wind } from "lucide-react";
import Image from "next/image";

const articles = [
    {
        title: "Mastering Composting: A Guide for Small-Scale Farmers",
        category: "Organic Farming",
        icon: BookOpen,
        image: "https://picsum.photos/seed/compost/600/400",
        imageHint: "compost heap",
    },
    {
        title: "Crop Rotation Techniques for Healthy Soil",
        category: "Organic Farming",
        icon: BookOpen,
        image: "https://picsum.photos/seed/rotation/600/400",
        imageHint: "crop rotation",
    },
    {
        title: "Video: Setting up a Vermicomposting Bin",
        category: "Video Guide",
        icon: Video,
        image: "https://picsum.photos/seed/vermi/600/400",
        imageHint: "earthworms soil",
    },
     {
        title: "Using Neem Oil as a Natural Pesticide",
        category: "Eco-Friendly Treatments",
        icon: BookOpen,
        image: "https://picsum.photos/seed/neem/600/400",
        imageHint: "neem leaf",
    },
];

export default function AdvisoryHubPage() {
    return (
        <div className="flex flex-1 flex-col">
            <PageHeader title="Sustainable Farming Advisory Hub" />
            <main className="flex-1 p-4 lg:p-6 space-y-6">
                <Card>
                    <CardContent className="p-6">
                         <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="Search for guides, videos, and articles..." className="pl-10" />
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article, index) => (
                         <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <Image src={article.image} alt={article.title} width={600} height={400} className="w-full h-40 object-cover" data-ai-hint={article.imageHint} />
                            <CardHeader>
                                <CardDescription className="flex items-center gap-2 text-sm">
                                    <article.icon className="h-4 w-4"/>
                                    {article.category}
                                </CardDescription>
                                <CardTitle className="text-lg font-headline leading-tight">{article.title}</CardTitle>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
