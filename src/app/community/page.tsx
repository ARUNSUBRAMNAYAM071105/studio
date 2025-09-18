
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp, UserPlus, Check } from "lucide-react";
import useLocalStorage from "@/hooks/use-local-storage";

const initialPosts = [
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
    },
    {
        id: 11,
        author: "Ananya Sharma",
        avatar: "https://picsum.photos/seed/ananya/100/100",
        time: "1 day ago",
        content: "Just got my soil test results back. pH is slightly acidic. Any organic recommendations to raise it before planting my vegetables?",
        likes: 19,
        comments: 7,
    },
    {
        id: 3,
        author: "Samuel Kariuki",
        avatar: "https://picsum.photos/seed/samuel/100/100",
        time: "3 days ago",
        content: "My tomatoes are suffering from blossom end rot. Besides calcium, what are some other organic solutions I can try? The soil pH is around 6.5.",
        likes: 8,
        comments: 5,
    },
    {
        id: 12,
        author: "Bosede Adeyemi",
        avatar: "https://picsum.photos/seed/bosede/100/100",
        time: "4 days ago",
        content: "Thinking about investing in a solar-powered water pump for my 2-acre farm. Has anyone made the switch? Was it worth the initial cost?",
        likes: 33,
        comments: 14,
    },
    {
        id: 4,
        author: "Fatima Al-Jamil",
        avatar: "https://picsum.photos/seed/fatima/100/100",
        time: "5 days ago",
        content: "I'm looking for advice on intercropping with sorghum. What plants have you found to be good companions to deter pests and improve yield?",
        likes: 18,
        comments: 6,
    },
    {
        id: 5,
        author: "David Chen",
        avatar: "https://picsum.photos/seed/david/100/100",
        time: "1 week ago",
        content: "Success story! I built a simple drip irrigation system using recycled plastic bottles for my vegetable garden. It has cut my water usage by half. Happy to share the design if anyone is interested.",
        likes: 45,
        comments: 15,
    },
    {
        id: 6,
        author: "Maria Garcia",
        avatar: "https://picsum.photos/seed/maria/100/100",
        time: "1 week ago",
        content: "Has anyone tried using marigolds as a natural nematicide in potato fields? I've read about it but would love to hear about real-world results.",
        likes: 22,
        comments: 9,
    },
     {
        id: 13,
        author: "Rajesh Kumar",
        avatar: "https://picsum.photos/seed/rajesh/100/100",
        time: "1 week ago",
        content: "The monsoon has been delayed in my region. What are some drought-resistant crops I can plant for the next cycle? Currently growing cotton and wheat.",
        likes: 41,
        comments: 18,
    },
    {
        id: 7,
        author: "Kenpachi Ramaswamy",
        avatar: "https://picsum.photos/seed/kenpachi/100/100",
        time: "2 weeks ago",
        content: "I'm setting up my first vermicomposting bin. What's the ideal ratio of greens to browns to start with for a healthy worm population?",
        likes: 31,
        comments: 11,
    },
    {
        id: 8,
        author: "Chidinma Okafor",
        avatar: "https://picsum.photos/seed/chidinma/100/100",
        time: "2 weeks ago",
        content: "Warning to farmers in the Ashanti Region: I've spotted early signs of Fall Armyworm in my young maize. Be vigilant and start scouting your fields!",
        likes: 50,
        comments: 20,
    },
    {
        id: 14,
        author: "Isabella Rossi",
        avatar: "https://picsum.photos/seed/isabella/100/100",
        time: "3 weeks ago",
        content: "I've started keeping bees on my farm for pollination. My fruit yields have already increased by 20%! Plus, fresh honey is a great bonus.",
        likes: 62,
        comments: 25,
    },
    {
        id: 9,
        author: "John Doe",
        avatar: "https://picsum.photos/seed/johnd/100/100",
        time: "3 weeks ago",
        content: "Does anyone have a good recipe for a homemade compost tea? I want to give my leafy greens a nutrient boost.",
        likes: 15,
        comments: 7,
    },
    {
        id: 10,
        author: "Priya Singh",
        avatar: "https://picsum.photos/seed/priya/100/100",
        time: "1 month ago",
        content: "How do you manage waterlogging in clay soil during the rainy season? My fields are getting swamped, and I'm worried about root rot.",
        likes: 28,
        comments: 12,
    },
    {
        id: 15,
        author: "Wei Li",
        avatar: "https://picsum.photos/seed/wei/100/100",
        time: "1 month ago",
        content: "I'm having trouble with birds eating my sunflower seeds. Besides netting, are there any effective, natural deterrents?",
        likes: 24,
        comments: 10,
    }
];

type FarmerProfile = {
  name: string;
};


export default function CommunityPage() {
    const [posts, setPosts] = useState(initialPosts);
    const [newPostContent, setNewPostContent] = useState("");
    const [profile] = useLocalStorage<FarmerProfile | null>("farmer-profile", null);
    
    const [followedAuthors, setFollowedAuthors] = useState<string[]>([]);
    const [likedPosts, setLikedPosts] = useState<number[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handlePost = () => {
        if (!newPostContent.trim()) return;

        const newPost = {
            id: Date.now(),
            author: profile?.name || "Anonymous",
            avatar: `https://picsum.photos/seed/${Date.now()}/100/100`,
            time: "Just now",
            content: newPostContent,
            likes: 0,
            comments: 0,
        };

        setPosts([newPost, ...posts]);
        setNewPostContent("");
    };

    const handleFollow = (author: string) => {
        setFollowedAuthors(prev => 
            prev.includes(author) ? prev.filter(a => a !== author) : [...prev, author]
        );
    };

    const handleLike = (postId: number) => {
        if (likedPosts.includes(postId)) return; // Prevent multiple likes

        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId ? { ...post, likes: post.likes + 1 } : post
            )
        );
        setLikedPosts(prev => [...prev, postId]);
    };
    
    const handleComment = (postId: number) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId ? { ...post, comments: post.comments + 1 } : post
            )
        );
    };

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
                                <AvatarFallback>{isClient ? (profile?.name?.charAt(0) || 'U') : null}</AvatarFallback>
                            </Avatar>
                            <Input 
                                placeholder="Share your knowledge or ask a question..." 
                                className="flex-1" 
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handlePost()}
                            />
                            <Button onClick={handlePost}>Post</Button>
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
                                    <Button 
                                        variant="link" 
                                        size="sm" 
                                        className="p-0 h-auto text-primary"
                                        onClick={() => handleFollow(post.author)}
                                    >
                                        {followedAuthors.includes(post.author) ? (
                                            <>
                                                <Check className="mr-1" /> Following
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="mr-1" /> Follow
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{post.content}</p>
                            </CardContent>
                            <CardFooter className="flex gap-4">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleLike(post.id)}
                                    disabled={likedPosts.includes(post.id)}
                                >
                                    <ThumbsUp className="mr-2" /> {post.likes}
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleComment(post.id)}
                                >
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

    