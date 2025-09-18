
"use client";

import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const articles = [
    {
        title: "Organic Pest Management",
        source: "USDA AMS",
        overview: "Provides foundational knowledge on organic pest management, including prevention, monitoring, and control strategies.",
        link: "https://www.ams.usda.gov/sites/default/files/media/Organic%20Pest%20Management_FINAL.pdf",
        image: "https://picsum.photos/seed/farmer-composting/600/400",
        imageHint: "farmer composting",
        tooltip: "Explore sustainable methods for controlling pests in organic farming."
    },
    {
        title: "On-Farm Composting Guide",
        source: "Farmwest",
        overview: "Offers practical guidance on setting up composting systems tailored for small and medium-scale farmers, emphasizing cost-effectiveness and nutrient recycling.",
        link: "https://farmwest.com/wp-content/uploads/2020/09/composting_guide.pdf",
        image: "https://picsum.photos/seed/sustainable-farm-aerial/600/400",
        imageHint: "sustainable farm aerial",
        tooltip: "Learn how to set up cost-effective composting systems on your farm."
    },
    {
        title: "Basics of Organic Integrated Pest Management",
        source: "Lincoln University",
        overview: "Covers the essential steps for implementing Integrated Pest Management (IPM) in organic farming, focusing on cultural, biological, and mechanical control methods.",
        link: "https://www.lincolnu.edu/_files/publications/basics-of-organic-ipm-gs-18-f-2015.pdf",
        image: "https://picsum.photos/seed/beneficial-insects/600/400",
        imageHint: "beneficial insects illustration",
        tooltip: "Implement Integrated Pest Management (IPM) strategies in your organic farm."
    },
    {
        title: "Resource Guide for Organic Insect and Disease Management",
        source: "SARE",
        overview: "Provides in-depth information on managing insect and disease issues in organic farming, including cultural practices, biological control, and resistant varieties.",
        link: "https://www.sare.org/wp-content/uploads/Resource-Guide-for-Organic-Insect-and-Disease-Management.pdf",
        image: "https://picsum.photos/seed/organic-pest-control/600/400",
        imageHint: "organic pest control illustration",
        tooltip: "Manage insect and disease issues with organic farming practices."
    },
    {
        title: "Farmer’s Compost Handbook",
        source: "FAO",
        overview: "An illustrated manual that teaches farmers how to produce compost at the household and small-farmer level, promoting sustainable waste recycling and soil health.",
        link: "https://openknowledge.fao.org/server/api/core/bitstreams/0658b4e0-53e3-4ed7-89d0-ff351bec1dff/content",
        image: "https://picsum.photos/seed/compost-manual-illustration/600/400",
        imageHint: "compost manual illustration",
        tooltip: "Master the art of composting to enhance soil health and recycle waste."
    },
    {
        title: "Backyard Composting",
        source: "Prince William County, Virginia",
        overview: "Offers a comprehensive guide on composting at home, including benefits, methods, and tips for beginners.",
        link: "https://www.pwcva.gov/assets/documents/public-works/Compost%20Bin%20Pub%20HORT-49P%2020151030084256.pdf",
        image: "https://picsum.photos/seed/home-composting-guide/600/400",
        imageHint: "home composting guide illustration",
        tooltip: "Start composting at home with this beginner-friendly guide."
    }
];

export default function KnowledgeHubPage() {
    return (
        <div className="flex flex-1 flex-col">
            <PageHeader title="Knowledge Hub" />
            <main className="flex-1 p-4 lg:p-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article) => (
                         <Card key={article.title} className="flex flex-col" title={article.tooltip}>
                           <CardHeader>
                                <div className="relative aspect-video w-full mb-4">
                                     <Image
                                        src={article.image}
                                        alt={article.title}
                                        fill
                                        className="rounded-t-lg object-cover"
                                        data-ai-hint={article.imageHint}
                                    />
                                </div>
                                <CardTitle className="font-headline text-xl">{article.title}</CardTitle>
                                <CardDescription>{article.source}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-sm text-muted-foreground">{article.overview}</p>
                            </CardContent>
                            <div className="p-6 pt-0">
                                <Button asChild variant="link" className="p-0">
                                    <Link href={article.link} target="_blank" rel="noopener noreferrer">
                                        Read More <ArrowRight className="ml-2" />
                                    </Link>
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
