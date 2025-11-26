
"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { aiTutoringTool, AiTutoringToolOutput } from "@/ai/flows/ai-tutoring-tool";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, TimerIcon, Volume2, Paperclip, X, Send, Bot, User as UserIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { parseISO, format, isAfter } from 'date-fns';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { updateProgress } from "@/services/progress";

type ChatMessage = {
    role: 'user' | 'model';
    question?: string;
    explanation?: string;
    example?: string;
    explanationAudio?: string;
    exampleAudio?: string;
    fileDataUri?: string;
    fileName?: string;
}

const formSchema = z.object({
  question: z.string().min(1, "Please enter a question."),
});

type FormData = z.infer<typeof formSchema>;

function CountdownTimer({ duration }: { duration: number }) {
    const [timeLeft, setTimeLeft] = useState(duration * 60);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const intervalId = setInterval(() => { setTimeLeft(timeLeft - 1); }, 1000);
        return () => clearInterval(intervalId);
    }, [timeLeft]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="flex items-center gap-2 text-lg font-semibold text-primary">
            <TimerIcon className="h-5 w-5" />
            <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
        </div>
    );
}

const ChatBubble = ({ message }: { message: ChatMessage }) => {
    const isUser = message.role === 'user';
    const audioExplanationRef = useRef<HTMLAudioElement>(null);
    const audioExampleRef = useRef<HTMLAudioElement>(null);

    const playAudio = (ref: React.RefObject<HTMLAudioElement>) => {
        ref.current?.play();
    };
    
    return (
        <div className={cn("flex items-start gap-4", isUser ? "justify-end" : "")}>
            {!isUser && (
                <Avatar className="h-8 w-8">
                    <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
            )}
            <div className={cn("max-w-md rounded-lg p-3", isUser ? "bg-primary text-primary-foreground" : "bg-muted")}>
                {isUser ? (
                    <p>{message.question}</p>
                ) : (
                    <div className="space-y-4">
                        {message.explanation && (
                            <div className="prose prose-sm">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold">Explanation</h4>
                                    {message.explanationAudio && (
                                        <Button variant="ghost" size="icon" onClick={() => playAudio(audioExplanationRef)}>
                                            <Volume2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                <p>{message.explanation}</p>
                                <audio ref={audioExplanationRef} src={message.explanationAudio} className="hidden" />
                            </div>
                        )}
                         {message.example && (
                            <div className="prose prose-sm">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold">Example</h4>
                                     {message.exampleAudio && (
                                        <Button variant="ghost" size="icon" onClick={() => playAudio(audioExampleRef)}>
                                            <Volume2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                <p>{message.example}</p>
                                 <audio ref={audioExampleRef} src={message.exampleAudio} className="hidden" />
                            </div>
                        )}
                    </div>
                )}
            </div>
             {isUser && (
                <Avatar className="h-8 w-8">
                    <AvatarFallback><UserIcon /></AvatarFallback>
                </Avatar>
            )}
        </div>
    )
}

export function TutorForm() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileDataUri, setFileDataUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);


  const studentProfilesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/studentProfiles`);
  }, [user, firestore]);

  const { data: studentProfiles, isLoading: isLoadingProfiles } = useCollection(studentProfilesQuery);
  const studentProfile = studentProfiles?.[0];

  const studyPlanQuery = useMemoFirebase(() => {
    if (!user || !firestore || !studentProfile) return null;
    return query(
        collection(firestore, `users/${user.uid}/studentProfiles/${studentProfile.id}/studyPlans`),
        orderBy('createdAt', 'desc'),
        limit(1)
    );
  }, [user, firestore, studentProfile]);

  const { data: studyPlans, isLoading: isLoadingStudyPlans } = useCollection(studyPlanQuery);
  const latestStudyPlan = studyPlans?.[0];

  const nextSession = useMemoFirebase(() => {
    if (!latestStudyPlan?.schedule) return null;
    const now = new Date();
    // Find the next session that is after the current time
    return latestStudyPlan.schedule
        .map(s => ({...s, dateTime: parseISO(`${s.date}T${s.time}`) }))
        .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
        .find(s => isAfter(s.dateTime, now));
  }, [latestStudyPlan]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { question: "" },
  });

   useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileDataUri(e.target?.result as string);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setFileDataUri(null);
    setFileName(null);
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function onSubmit(data: FormData) {
     if (!studentProfile || !firestore || !user) {
        toast({
            variant: "destructive",
            title: "Profile Needed",
            description: "Please complete your student profile first.",
        });
        return;
    }
    
    if (nextSession && !sessionStartTime) {
        setSessionStartTime(new Date());
    }

    setIsLoading(true);

    const userMessage: ChatMessage = {
        role: 'user',
        question: data.question,
        ...(fileDataUri && { fileDataUri, fileName })
    };
    setChatHistory(prev => [...prev, userMessage]);

    const historyForApi = chatHistory.map(msg => {
        if (msg.role === 'user') {
            return { user: msg.question! };
        }
        return { model: `${msg.explanation}\n${msg.example}` };
    });

    try {
      const result = await aiTutoringTool({
        studentName: studentProfile.name,
        gradeLevel: studentProfile.gradeLevel,
        country: studentProfile.country,
        preferredLearningLanguage: studentProfile.preferredLearningLanguage,
        subject: latestStudyPlan?.subject || "General",
        topic: nextSession?.topic || "General Question",
        studyPlan: latestStudyPlan?.content,
        fileDataUri: fileDataUri || undefined,
        history: historyForApi,
        question: data.question,
      });

      const modelMessage: ChatMessage = { role: 'model', ...result };
      setChatHistory(prev => [...prev, modelMessage]);
      form.reset();
      removeFile();

       // Update progress only if there was an active session for this interaction
      if (user && firestore && studentProfile && latestStudyPlan && nextSession && sessionStartTime) {
          updateProgress({
              firestore,
              userId: user.uid,
              studentProfileId: studentProfile.id,
              studyPlanId: latestStudyPlan.id,
              studySessionId: nextSession.id,
              sessionStartTime: sessionStartTime,
          });
      }


    } catch (error) {
      console.error("Error with AI Tutor:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get a response from the tutor. Please try again.",
      });
      // Optionally remove the user's message if the API fails
      setChatHistory(prev => prev.slice(0, prev.length -1));

    } finally {
      setIsLoading(false);
    }
  }


  if (isLoadingProfiles || isLoadingStudyPlans) {
    return (
        <div className="p-6 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Loading your learning context...</p>
        </div>
    )
  }

  return (
    <>
      {nextSession ? (
        <Card className="mb-6 bg-secondary/50">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Next Scheduled Session</CardTitle>
                        <CardDescription>Your AI Professor is ready to help you with this topic.</CardDescription>
                    </div>
                    <CountdownTimer duration={nextSession.duration} />
                </div>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
                <div className="grid grid-cols-2">
                    <span className="font-semibold">Topic:</span>
                    <span>{nextSession.topic}</span>
                </div>
                 <div className="grid grid-cols-2">
                    <span className="font-semibold">Subject:</span>
                    <span>{latestStudyPlan?.subject}</span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="font-semibold">Time:</span>
                    <span>{format(nextSession.dateTime, 'MMMM d, yyyy')} at {format(nextSession.dateTime, 'p')}</span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="font-semibold">Duration:</span>
                    <span>{nextSession.duration} minutes</span>
                </div>
            </CardContent>
        </Card>
      ) : (
         <Card className="mb-6">
            <CardHeader>
              <CardTitle>No Upcoming Sessions</CardTitle>
              <CardDescription>You can ask general questions, and your AI Professor will assist you.</CardDescription>
            </CardHeader>
        </Card>
      )}

      <Card className="flex flex-col h-[60vh]">
          <CardHeader>
            <CardTitle>Chat with your Professor</CardTitle>
          </CardHeader>
          <CardContent ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4">
              {chatHistory.map((msg, index) => (
                  <ChatBubble key={index} message={msg} />
              ))}
               {isLoading && (
                    <div className="flex items-start gap-4">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback><Bot /></AvatarFallback>
                        </Avatar>
                        <div className="max-w-md rounded-lg p-3 bg-muted">
                           <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                    </div>
                )}
          </CardContent>
          <div className="p-4 border-t">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative">
                                    <Textarea
                                        placeholder={nextSession ? "Ask a question about today's topic..." : "Ask a general question..."}
                                        rows={2}
                                        className="pr-20"
                                        {...field}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                form.handleSubmit(onSubmit)();
                                            }
                                        }}
                                    />
                                    <div className="absolute bottom-2 right-2 flex items-center gap-2">
                                        <Button type="button" size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-transparent focus:bg-transparent" onClick={() => fileInputRef.current?.click()}>
                                            <Paperclip className="h-4 w-4" />
                                            <span className="sr-only">Upload File</span>
                                        </Button>
                                        <Button type="submit" size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-transparent focus:bg-transparent" disabled={isLoading || !studentProfile}>
                                            <Send className="h-4 w-4" />
                                            <span className="sr-only">Send</span>
                                        </Button>
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*,application/pdf,.doc,.docx,.txt"
                    />
                    {fileName && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary px-3 py-1.5 rounded-md w-fit">
                            <span>{fileName}</span>
                            <Button type="button" variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-transparent focus:bg-transparent" onClick={removeFile}>
                                <X className="h-4 w-4"/>
                            </Button>
                        </div>
                    )}
                </form>
            </Form>
          </div>
      </Card>
    </>
  );
}
