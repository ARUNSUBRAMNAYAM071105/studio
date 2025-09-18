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
    { id: 1, title: "Eco-Friendly Pest Control for Tomatoes", type: "Article", crop: "Tomato", image: "https://picsum.photos/seed/tomato-pest/600/400", imageHint: "tomato pest" },
    { id: 2, title: "Identifying Maize Leaf Blight (Video)", type: "Video", crop: "Maize", image: "https://picsum.photos/seed/maize-blight/600/400", imageHint: "maize blight" },
    { id: 3, title: "Crop Rotation Best Practices", type: "Infographic", crop: "All", image: "https://picsum.photos/seed/crop-rotation/600/400", imageHint: "crop rotation" },
    { id: 4, title: "Understanding Late Blight in Potatoes", type: "Article", crop: "Potato", image: "https://picsum.photos/seed/potato-blight/600/400", imageHint: "potato blight" },
    { id: 5, title: "Soil Health Explained (Video)", type: "Video", crop: "All", image: "https://picsum.photos/seed/soil-health/600/400", imageHint: "soil health" },
    { id: 6, title: "Water Management for Wheat Crops", type: "Infographic", crop: "Wheat", image: "https://picsum.photos/seed/water-manage/600/400", imageHint: "water management" },
    { id: 7, title: "Growing Guide for Bell Peppers", type: "Article", crop: "Pepper", image: "https://picsum.photos/seed/bell-pepper/600/400", imageHint: "bell peppers" },
    { id: 8, title: "Integrated Pest Management for Soybeans", type: "Article", crop: "Soybean", image: "https://picsum.photos/seed/soybean-pest/600/400", imageHint: "soybean field" },
    { id: 9, title: "Common Rust in Corn: Identification and Treatment", type: "Video", crop: "Maize", image: "https://picsum.photos/seed/corn-rust/600/400", imageHint: "corn rust" },
    { id: 10, title: "Nutrient Management for Grapes", type: "Infographic", crop: "Grape", image: "https://picsum.photos/seed/grape-nutrient/600/400", imageHint: "vineyard grapes" },
];

const cropTypes = ["All", "Tomato", "Maize", "Potato", "Wheat", "Pepper", "Soybean", "Grape"];


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
