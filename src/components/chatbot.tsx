"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Bot, User, CornerDownLeft, Loader2, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chatAdvisor, textToSpeech } from "@/ai/flows/chatbot-advisor";

type Message = {
  role: "user" | "model";
  content: string;
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isSpeaking, startSpeakingTransition] = useTransition();

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    startTransition(async () => {
        const historyForAI = messages.map(msg => ({
            role: msg.role as 'user' | 'model',
            content: [{ text: msg.content }]
        }));

      const result = await chatAdvisor({ history: historyForAI, prompt: input });
      const modelMessage: Message = { role: "model", content: result.response };
      setMessages((prev) => [...prev, modelMessage]);
    });
  };

  const handleSpeak = (text: string) => {
    startSpeakingTransition(async () => {
      try {
        const result = await textToSpeech(text);
        if (audioRef.current) {
            audioRef.current.src = result.media;
            audioRef.current.play();
        }
      } catch (error) {
        console.error("Error generating speech:", error);
      }
    });
  };


  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 rounded-full w-16 h-16 shadow-lg z-50"
      >
        <Bot className="w-8 h-8" />
      </Button>
    );
  }

  return (
    <Card className="fixed top-4 right-4 w-full max-w-sm h-[60vh] flex flex-col shadow-2xl z-50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 font-headline"><Bot /> AI Advisor</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4"/>
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
           <div className="p-6 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'model' && <Bot className="flex-shrink-0" />}
                <div className={`rounded-lg p-3 max-w-[85%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <p className="text-sm">{msg.content}</p>
                   {msg.role === 'model' && (
                      <Button onClick={() => handleSpeak(msg.content)} variant="ghost" size="icon" className="mt-2 h-6 w-6" disabled={isSpeaking}>
                          <Volume2 className="h-4 w-4" />
                      </Button>
                    )}
                </div>
                 {msg.role === 'user' && <User className="flex-shrink-0" />}
              </div>
            ))}
            {isPending && (
                <div className="flex gap-2">
                    <Bot className="flex-shrink-0" />
                    <div className="rounded-lg p-3 bg-muted flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin"/>
                    </div>
                </div>
            )}
            </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            disabled={isPending}
          />
          <Button type="submit" disabled={isPending}>
            <CornerDownLeft />
          </Button>
        </form>
      </CardFooter>
      <audio ref={audioRef} className="hidden" />
    </Card>
  );
}
