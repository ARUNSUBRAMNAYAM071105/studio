"use client";

import { useState } from "react";
import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Youtube, Newspaper, BarChart, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const allArticles = [
    { id: 1, title: "Common Plant Diseases and Their Best Organic Remedies", type: "Article", crop: "All", image: "https://picsum.photos/seed/organic-remedy/600/400", imageHint: "organic remedy" },
    { id: 2, title: "Effects of climate change on plant pathogens", type: "Article", crop: "All", image: "https://picsum.photos/seed/climate-pathogen/600/400", imageHint: "dry field" },
    { id: 3, title: "How weather influences fungal and oomycete crop disease", type: "Article", crop: "All", image: "https://picsum.photos/seed/weather-fungus/600/400", imageHint: "stormy field" },
    { id: 4, title: "Biological Control of Plant Diseases: An Evolutionary Approach", type: "Article", crop: "All", image: "https://picsum.photos/seed/bio-control/600/400", imageHint: "ladybug leaf" },
    { id: 5, title: "Soilborne Disease Management in Organic Vegetable Production", type: "Article", crop: "Vegetable", image: "https://picsum.photos/seed/soil-disease/600/400", imageHint: "vegetable soil" },
    { id: 6, title: "Plant Diseases: What You Need to Know to Prevent Spread", type: "Article", crop: "All", image: "https://picsum.photos/seed/prevent-spread/600/400", imageHint: "healthy plants" },
    { id: 7, title: "How Plant Diseases Reduce Crop Yields & Proven Practices", type: "Article", crop: "All", image: "https://picsum.photos/seed/crop-yield/600/400", imageHint: "low yield" },
    { id: 8, title: "Growing Guide for Bell Peppers", type: "Article", crop: "Pepper", image: "https://picsum.photos/seed/bell-pepper/600/400", imageHint: "bell peppers" },
    { id: 9, title: "Nutrient Management for Grapes", type: "Infographic", crop: "Grape", image: "https://picsum.photos/seed/grape-nutrient/600/400", imageHint: "vineyard grapes" },
];

const cropTypes = ["All", "Vegetable", "Pepper", "Grape"];


const TypeIcon = ({ type, className }: { type: string, className?: string }) => {
    switch (type) {
        case "Article": return <Newspaper className={className} />;
        case "Video": return <Youtube className={className} />;
        case "Infographic": return <BarChart className={className} />;
        default: return null;
    }
};

export default function KnowledgeHubPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCrop, setSelectedCrop] = useState("all");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleCropChange = (value: string) => {
        setSelectedCrop(value.toLowerCase());
    };

    const filteredArticles = allArticles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCrop = selectedCrop === "all" || article.crop.toLowerCase() === selectedCrop || article.crop === "All";
        return matchesSearch && matchesCrop;
    });

    return (
        <div className="flex flex-1 flex-col">
            <PageHeader title="Knowledge Hub" />
            <main className="flex-1 p-4 lg:p-6 space-y-6">
                <Card>
                    <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input 
                                placeholder="Search articles..." 
                                className="pl-10" 
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                             {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <X className="h-4 w-4 text-muted-foreground" />
                                </button>
                            )}
                        </div>
                        <div className="flex gap-4">
                            <Select onValueChange={handleCropChange} defaultValue="all">
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Filter by Crop" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cropTypes.map(crop => (
                                         <SelectItem key={crop} value={crop.toLowerCase()}>{crop === 'All' ? 'All Crops' : crop}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredArticles.length > 0 ? (
                        filteredArticles.map((article) => (
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
                        ))
                    ) : (
                        <p className="text-muted-foreground md:col-span-3 text-center">No articles found matching your criteria.</p>
                    )}
                </div>
            </main>
        </div>
    );
}
