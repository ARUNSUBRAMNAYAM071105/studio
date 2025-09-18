"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { BellRing, LineChart } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { CartesianGrid, XAxis, Line, Area, YAxis } from "recharts"
import { AreaChart, LineChart as RechartsLineChart } from "recharts"


const lastScans = [
    { id: 1, date: "2024-07-20", crop: "Tomato", disease: "Late Blight", result: "92% Confidence" },
    { id: 2, date: "2024-07-18", crop: "Maize", disease: "Northern Leaf Blight", result: "88% Confidence" },
    { id: 3, date: "2024-07-17", crop: "Tomato", disease: "Healthy", result: "99% Confidence" },
];

const chartData = [
  { month: "Jan", disease: 5 },
  { month: "Feb", disease: 8 },
  { month: "Mar", disease: 12 },
  { month: "Apr", disease: 7 },
  { month: "May", disease: 6 },
  { month: "Jun", disease: 15 },
  { month: "Jul", disease: 10 },
];

const chartConfig = {
  disease: {
    label: "Disease Incidents",
    color: "hsl(var(--primary))",
  },
} satisfies import("@/components/ui/chart").ChartConfig;

export default function FarmerDashboardPage() {
    return (
        <div className="flex flex-1 flex-col">
            <PageHeader title="My Dashboard" />
            <main className="flex-1 p-4 lg:p-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Weather Risk</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Alert variant="destructive">
                                <BellRing className="h-4 w-4" />
                                <AlertTitle>High Humidity Warning</AlertTitle>
                                <AlertDescription>
                                    High humidity expected in the next 48 hours. Increased risk of fungal diseases.
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                     <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Disease History</CardTitle>
                            <CardDescription>Detected disease incidents over the past months.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <ChartContainer config={chartConfig} className="h-[200px] w-full">
                                <AreaChart accessibilityLayer data={chartData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                                    <YAxis tickLine={false} tickMargin={10} axisLine={false} />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                    <defs>
                                        <linearGradient id="fillDisease" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-disease)" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="var(--color-disease)" stopOpacity={0.1} />
                                        </linearGradient>
                                    </defs>
                                    <Area type="natural" dataKey="disease" stroke="var(--color-disease)" fill="url(#fillDisease)" strokeWidth={2} dot />
                                </AreaChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Last Scans</CardTitle>
                        <CardDescription>A log of your most recent crop scans.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Crop</TableHead>
                                    <TableHead>Disease</TableHead>
                                    <TableHead>Result</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lastScans.map((scan) => (
                                    <TableRow key={scan.id}>
                                        <TableCell>{scan.date}</TableCell>
                                        <TableCell>{scan.crop}</TableCell>
                                        <TableCell>
                                            <Badge variant={scan.disease === 'Healthy' ? 'default' : 'destructive'}>{scan.disease}</Badge>
                                        </TableCell>
                                        <TableCell>{scan.result}</TableCell>
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
