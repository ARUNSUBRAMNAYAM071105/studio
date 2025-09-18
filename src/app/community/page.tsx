"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp, UserPlus } from "lucide-react";

const posts = [
    {
        id: 1,
        author: "Juma Omondi",
        avatar: "https://picsum.photos/seed/juma/100/100",
        time: "2 hours ago",
        content: "I've had great success using a fermented garlic and chili spray to keep aphids off my kale. Has anyone else tried this? It's fully organic and works better than the chemical stuff I used before.",
        likes: 12,
        comments: 3,
    },
    {
        id: 2,
        author: "Asha Devi",
        avatar: "https://picsum.photos/seed/asha/100/100",
        time: "1 day ago",
        content: "What are the best cover crops to use for improving soil health for maize in the Rift Valley? I'm preparing my field for the next season and want to try something new.",
        likes: 25,
        comments: 8,
    }
];

export default function CommunityPage() {
    return (
        <div className="flex flex-1 flex-col">
            <PageHeader title="Farmer Community" />
            <main className="flex-1 p-4 lg:p-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Community Forum</CardTitle>
                        <CardDescription>Ask questions, share advice, and learn from fellow farmers.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4">
                            <Avatar>
                                <AvatarImage src="https://picsum.photos/seed/farmer/100/100" data-ai-hint="farmer" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <Input placeholder="Share your knowledge or ask a question..." className="flex-1" />
                            <Button>Post</Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    {posts.map(post => (
                        <Card key={post.id}>
                            <CardHeader className="flex flex-row items-start gap-4">
                                <Avatar>
                                    <AvatarImage src={post.avatar} data-ai-hint="farmer person" />
                                    <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold">{post.author}</p>
                                        <p className="text-xs text-muted-foreground">{post.time}</p>
                                    </div>
                                    <Button variant="link" size="sm" className="p-0 h-auto text-primary">
                                        <UserPlus className="mr-1" /> Follow
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{post.content}</p>
                            </CardContent>
                            <CardFooter className="flex gap-4">
                                <Button variant="ghost" size="sm">
                                    <ThumbsUp className="mr-2" /> {post.likes}
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <MessageSquare className="mr-2" /> {post.comments}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
