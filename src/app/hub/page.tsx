"use client";

import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Youtube, Newspaper, BarChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const articles = [
    { id: 1, title: "Eco-Friendly Pest Control for Tomatoes", type: "Article", crop: "Tomato", image: "https://picsum.photos/seed/tomato-pest/600/400", imageHint: "tomato pest" },
    { id: 2, title: "Identifying Maize Leaf Blight (Video)", type: "Video", crop: "Maize", image: "https://picsum.photos/seed/maize-blight/600/400", imageHint: "maize blight" },
    { id: 3, title: "Crop Rotation Best Practices", type: "Infographic", crop: "All", image: "https://picsum.photos/seed/crop-rotation/600/400", imageHint: "crop rotation" },
    { id: 4, title: "Understanding Late Blight in Potatoes", type: "Article", crop: "Potato", image: "https://picsum.photos/seed/potato-blight/600/400", imageHint: "potato blight" },
    { id: 5, title: "Soil Health Explained (Video)", type: "Video", crop: "All", image: "https://picsum.photos/seed/soil-health/600/400", imageHint: "soil health" },
    { id: 6, title: "Water Management Infographic", type: "Infographic", crop: "All", image: "https://picsum.photos/seed/water-manage/600/400", imageHint: "water management" },
];

const TypeIcon = ({ type, className }: { type: string, className?: string }) => {
    switch (type) {
        case "Article": return <Newspaper className={className} />;
        case "Video": return <Youtube className={className} />;
        case "Infographic": return <BarChart className={className} />;
        default: return null;
    }
};

export default function KnowledgeHubPage() {
    return (
        <div className="flex flex-1 flex-col">
            <PageHeader title="Knowledge Hub" />
            <main className="flex-1 p-4 lg:p-6 space-y-6">
                <Card>
                    <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="Search articles..." className="pl-10" />
                        </div>
                        <div className="flex gap-4">
                            <Select>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Filter by Crop" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Crops</SelectItem>
                                    <SelectItem value="tomato">Tomato</SelectItem>
                                    <SelectItem value="maize">Maize</SelectItem>
                                    <SelectItem value="potato">Potato</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Filter by Disease" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Diseases</SelectItem>
                                    <SelectItem value="blight">Blight</SelectItem>
                                    <SelectItem value="rust">Rust</SelectItem>
                                    <SelectItem value="mildew">Mildew</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article) => (
                        <Card key={article.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                            <div className="relative h-48 w-full">
                                <Image src={article.image} alt={article.title} fill className="object-cover" data-ai-hint={article.imageHint} />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                                <div className="absolute top-2 right-2">
                                     <Badge variant="secondary" className="flex items-center gap-1">
                                        <TypeIcon type={article.type} className="h-4 w-4" />
                                        {article.type}
                                    </Badge>
                                </div>
                            </div>
                            <CardHeader>
                                <CardTitle className="font-headline text-xl">{article.title}</CardTitle>
                                <CardDescription>Crop: {article.crop}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
