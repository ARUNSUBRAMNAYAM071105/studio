"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, MessageSquare } from "lucide-react";
import Image from "next/image";

const posts = [
    {
        id: 1,
        author: "Jomo Kenyatta",
        avatar: "https://picsum.photos/seed/jomo/100/100",
        time: "2h ago",
        content: "I'm seeing some strange spots on my maize leaves. Has anyone seen this before? Attaching a photo.",
        image: "https://picsum.photos/seed/maize-spots/600/400",
        imageHint: "maize spots",
        likes: 12,
        comments: 3,
    },
    {
        id: 2,
        author: "Amina Yusuf",
        avatar: "https://picsum.photos/seed/amina/100/100",
        time: "5h ago",
        content: "Great harvest this season! Using the organic fertilizer recipe from the Knowledge Hub worked wonders for my tomatoes.",
        likes: 45,
        comments: 8,
    },
];

export default function CommunityPage() {
    return (
        <div className="flex flex-1 flex-col">
            <PageHeader title="Community Forum" />
            <main className="flex-1 p-4 lg:p-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Start a Discussion</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea placeholder="Share your tips, ask questions, or post an update..." />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <select className="bg-background border border-border rounded-md px-2 py-1 text-sm">
                            <option>English</option>
                            <option>Swahili</option>
                            <option>Hindi</option>
                        </select>
                        <Button>Post</Button>
                    </CardFooter>
                </Card>

                <div className="space-y-6">
                    {posts.map((post) => (
                        <Card key={post.id}>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={post.avatar} data-ai-hint="farmer portrait" />
                                        <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{post.author}</p>
                                        <p className="text-xs text-muted-foreground">{post.time}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4">{post.content}</p>
                                {post.image && (
                                    <div className="relative h-64 w-full rounded-lg overflow-hidden">
                                        <Image src={post.image} alt="User upload" fill className="object-cover" data-ai-hint={post.imageHint} />
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex gap-4 border-t pt-4">
                                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                    <ThumbsUp className="h-4 w-4" /> {post.likes}
                                </Button>
                                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4" /> {post.comments}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
