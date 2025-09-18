
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown } from "lucide-react";

const cropPrices = [
    { crop: 'Maize', price: 22, unit: 'kg', change: 0.5, trend: 'up' },
    { crop: 'Beans', price: 95, unit: 'kg', change: -1.2, trend: 'down' },
    { crop: 'Tomatoes', price: 40, unit: 'kg', change: 2.5, trend: 'up' },
    { crop: 'Potatoes', price: 30, unit: 'kg', change: 1.1, trend: 'up' },
    { crop: 'Onions', price: 35, unit: 'kg', change: -0.5, trend: 'down' },
    { crop: 'Cabbages', price: 25, unit: 'kg', change: 0.0, trend: 'stable' },
    { crop: 'Bell Peppers', price: 60, unit: 'kg', change: 3.0, trend: 'up' },
    { crop: 'Grapes', price: 80, unit: 'kg', change: -2.0, trend: 'down' },
    { crop: 'Wheat', price: 25, unit: 'kg', change: 0.2, trend: 'up' },
    { crop: 'Rice (Basmati)', price: 110, unit: 'kg', change: -1.5, trend: 'down' },
    { crop: 'Sugarcane', price: 4, unit: 'kg', change: 0.1, trend: 'up' },
    { crop: 'Cotton', price: 200, unit: 'kg', change: 5.0, trend: 'up' },
    { crop: 'Soybean', price: 45, unit: 'kg', change: -0.8, trend: 'down' },
    { crop: 'Groundnut', price: 120, unit: 'kg', change: 2.3, trend: 'up' },
    { crop: 'Mustard', price: 60, unit: 'kg', change: -1.0, trend: 'down' },
    { crop: 'Chickpeas (Chana)', price: 70, unit: 'kg', change: 1.5, trend: 'up' },
    { crop: 'Lentils (Masoor)', price: 85, unit: 'kg', change: 0.5, trend: 'up' },
    { crop: 'Pigeon Peas (Arhar)', price: 130, unit: 'kg', change: -2.5, trend: 'down' },
    { crop: 'Green Gram (Moong)', price: 100, unit: 'kg', change: 1.0, trend: 'up' },
    { crop: 'Black Gram (Urad)', price: 115, unit: 'kg', change: 0.0, trend: 'stable' },
    { crop: 'Carrots', price: 40, unit: 'kg', change: -0.5, trend: 'down' },
    { crop: 'Cauliflower', price: 30, unit: 'kg', change: 1.8, trend: 'up' },
    { crop 'Spinach', price: 20, unit: 'bunch', change: 0.2, trend: 'up' },
    { crop: 'Okra (Lady\'s finger)', price: 50, unit: 'kg', change: -1.0, trend: 'down' },
    { crop: 'Brinjal (Eggplant)', price: 35, unit: 'kg', change: 0.7, trend: 'up' },
    { crop: 'Ginger', price: 150, unit: 'kg', change: -5.0, trend: 'down' },
    { crop: 'Garlic', price: 200, unit: 'kg', change: 10.0, trend: 'up' },
    { crop: 'Turmeric', price: 90, unit: 'kg', change: 1.2, trend: 'up' },
];

export default function MarketAnalysisPage() {

    const TrendArrow = ({ trend }: { trend: string }) => {
        if (trend === 'up') return <ArrowUp className="h-4 w-4 text-green-500" />;
        if (trend === 'down') return <ArrowDown className="h-4 w-4 text-red-500" />;
        return <span className="h-4 w-4 text-gray-500">-</span>;
    };

    return (
        <div className="flex flex-1 flex-col">
            <PageHeader title="Market Crop Price Analysis" />
            <main className="flex-1 p-4 lg:p-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Current Market Prices</CardTitle>
                        <CardDescription>Live prices from local and regional markets in India. All prices in INR (₹).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Crop</TableHead>
                                    <TableHead className="text-right">Price (per unit)</TableHead>
                                    <TableHead className="text-right">24h Change (₹)</TableHead>
                                    <TableHead className="text-center">Trend</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cropPrices.map((item) => (
                                    <TableRow key={item.crop}>
                                        <TableCell className="font-medium">{item.crop}</TableCell>
                                        <TableCell className="text-right font-mono">₹{item.price.toFixed(2)} / {item.unit}</TableCell>
                                        <TableCell className={`text-right font-mono ${item.change > 0 ? 'text-green-500' : item.change < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                            {item.change > 0 ? '+' : ''}{item.change.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="flex justify-center items-center">
                                            <TrendArrow trend={item.trend} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
