"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ScanLine, Bell, LineChart } from "lucide-react";
import useLocalStorage from "@/hooks/use-local-storage";


const lastScans = [
    { id: 1, date: "2024-07-20", crop: "Tomato", disease: "Late Blight", result: "92% Confidence" },
    { id: 2, date: "2024-07-18", crop: "Maize", disease: "Northern Leaf Blight", result: "88% Confidence" },
    { id: 3, date: "2024-07-17", crop: "Tomato", disease: "Healthy", result: "99% Confidence" },
];


export default function HomePage() {
  const [profile] = useLocalStorage<{ name: string } | null>("farmer-profile", null);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // No condition to check for `isClient` because we want this to run on the first client-side render
    if (!profile) {
      router.push('/login');
    }
  }, [profile, router]);

  if (!isClient || !profile) {
    // You can render a loading spinner here if you want
    return null; 
  }


  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title={`Welcome, ${profile.name}!`} />
      <main className="flex-1 p-4 lg:p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="flex flex-col justify-center items-center text-center p-6 hover:bg-accent/50 transition-colors">
            <ScanLine className="w-12 h-12 text-primary mb-4" />
            <CardTitle className="font-headline">Scan Crop</CardTitle>
            <CardDescription className="mb-4">Detect diseases instantly</CardDescription>
            <Button asChild>
                <Link href="/detect">Start Scan <ArrowRight className="ml-2"/></Link>
            </Button>
          </Card>
           <Card className="flex flex-col justify-center items-center text-center p-6 hover:bg-accent/50 transition-colors">
            <LineChart className="w-12 h-12 text-primary mb-4" />
            <CardTitle className="font-headline">Market Analysis</CardTitle>
            <CardDescription className="mb-4">View latest crop prices</CardDescription>
            <Button asChild>
                <Link href="/market">View Market <ArrowRight className="ml-2"/></Link>
            </Button>
          </Card>
           <Card className="flex flex-col justify-center items-center text-center p-6 hover:bg-accent/50 transition-colors">
            <Bell className="w-12 h-12 text-primary mb-4" />
            <CardTitle className="font-headline">Alerts</CardTitle>
            <CardDescription className="mb-4">Check for outbreak warnings</CardDescription>
            <Button asChild>
                <Link href="/warnings">View Alerts <ArrowRight className="ml-2"/></Link>
            </Button>
          </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Recent Scans</CardTitle>
                <CardDescription>Your latest disease detection results.</CardDescription>
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
