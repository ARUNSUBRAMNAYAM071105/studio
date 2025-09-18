
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
        overview: "A visual representation of best practices in organic pest management, showcasing various techniques and tools used in organic farming.",
        link: "https://www.ams.usda.gov/sites/default/files/media/Organic%20Pest%20Management_FINAL.pdf",
        image: "https://picsum.photos/seed/organic-farm/600/400",
        imageHint: "organic farm management",
        tooltip: "Explore sustainable methods for controlling pests in organic farming."
    },
    {
        title: "On-Farm Composting Guide",
        source: "Farmwest",
        overview: "An informative guide on setting up composting systems on farms, emphasizing sustainable practices and benefits.",
        link: "https://www.producer.com/wp-content/uploads/2021/03/composting-1024x576.jpg",
        image: "https://picsum.photos/seed/compost-systems/600/400",
        imageHint: "farm composting system",
        tooltip: "Learn how to set up cost-effective composting systems on your farm."
    },
    {
        title: "Basics of Organic Pest Management",
        source: "Lincoln University",
        overview: "A foundational resource covering the essentials of organic pest management, including prevention, monitoring, and control strategies.",
        link: "https://www.lincolnu.edu/_files/publications/basics-of-organic-ipm-gs-18-f-2015.pdf",
        image: "https://picsum.photos/seed/pest-monitoring/600/400",
        imageHint: "pest monitoring",
        tooltip: "Implement Integrated Pest Management (IPM) strategies in your organic farm."
    },
    {
        title: "Resource Guide for Organic Insect and Disease Management",
        source: "SARE",
        overview: "A comprehensive guide offering strategies for managing insects and diseases in organic farming systems.",
        link: "https://www.sare.org/wp-content/uploads/Resource-Guide-for-Organic-Insect-and-Disease-Management.pdf",
        image: "https://picsum.photos/seed/crop-disease/600/400",
        imageHint: "crop disease",
        tooltip: "Manage insect and disease issues with organic farming practices."
    },
    {
        title: "Farmer’s Compost Handbook",
        source: "FAO",
        overview: "An illustrated manual that teaches farmers how to produce compost at the household and small-farmer level, promoting sustainable waste recycling and soil health.",
        link: "https://openknowledge.fao.org/server/api/core/bitstreams/0658b4e0-53e3-4ed7-89d0-ff351bec1dff/content",
        image: "https://picsum.photos/seed/groundnut-crop/600/400",
        imageHint: "groundnut crop",
        tooltip: "Master the art of composting to enhance soil health and recycle waste."
    },
    {
        title: "Backyard Composting",
        source: "Prince William County, Virginia",
        overview: "A comprehensive guide on composting at home, including benefits, methods, and tips for beginners.",
        link: "https://www.pwcva.gov/assets/documents/public-works/Compost%20Bin%20Pub%20HORT-49P%2020151030084256.pdf",
        image: "https://picsum.photos/seed/soil-management/600/400",
        imageHint: "soil management",
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
