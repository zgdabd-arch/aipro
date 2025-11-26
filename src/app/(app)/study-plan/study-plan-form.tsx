
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateStudyPlan, StudyPlanOutput } from "@/ai/flows/personalized-study-plan";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, Wand2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, useCollection, useMemoFirebase, errorEmitter } from "@/firebase";
import { collection, doc, addDoc } from 'firebase/firestore';
import { FirestorePermissionError } from "@/firebase/errors";


const formSchema = z.object({
  subject: z.string().min(2, "Subject is required."),
  curriculum: z.string().min(2, "Curriculum is required."),
  educationalMaterials: z.string().min(2, "Please list available materials."),
  studyTimePreference: z.string().min(2, "Preferred study time is required."),
  studyDurationPreference: z.string().min(2, "Preferred session duration is required."),
});

type FormData = z.infer<typeof formSchema>;

export function StudyPlanForm() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [generatedPlan, setGeneratedPlan] = useState<StudyPlanOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const studentProfilesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/studentProfiles`);
  }, [user, firestore]);

  const { data: studentProfiles, isLoading: isLoadingProfiles } = useCollection(studentProfilesQuery);
  const studentProfile = studentProfiles?.[0];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      curriculum: "",
      educationalMaterials: "",
      studyTimePreference: "",
      studyDurationPreference: "",
    },
  });

  async function onGenerate(data: FormData) {
    if (!studentProfile) {
        toast({
            variant: "destructive",
            title: "Profile Not Found",
            description: "Please complete your student profile first.",
        });
        return;
    }

    setIsGenerating(true);
    setGeneratedPlan(null);
    try {
      const result = await generateStudyPlan({
        name: studentProfile.name,
        age: studentProfile.age,
        gradeLevel: studentProfile.gradeLevel,
        country: studentProfile.country,
        preferredLearningLanguage: studentProfile.preferredLearningLanguage,
        ...data,
      });
      setGeneratedPlan(result);
    } catch (error) {
      console.error("Error generating study plan:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate study plan. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  async function onConfirmAndSave() {
    if (!generatedPlan || !user || !firestore || !studentProfile) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "No plan to save or user not found.",
        });
        return;
    }
    
    setIsSaving(true);
    try {
        const studyPlansCollection = collection(firestore, `users/${user.uid}/studentProfiles/${studentProfile.id}/studyPlans`);
        const newPlanData = {
          subject: form.getValues().subject,
          content: generatedPlan.studyPlan,
          schedule: generatedPlan.schedule || [], // Save the structured schedule
          studentProfileId: studentProfile.id,
          createdAt: new Date().toISOString(),
        };

        await addDoc(studyPlansCollection, newPlanData);
        
        toast({
            title: "Plan Confirmed!",
            description: "Your new study plan is now active.",
        });
        setGeneratedPlan(null); // Clear the plan from view after saving
    } catch (error) {
        console.error("Error saving study plan:", error);
        const permissionError = new FirestorePermissionError({
            path: `users/${user.uid}/studentProfiles/${studentProfile.id}/studyPlans`,
            operation: 'create',
            requestResourceData: generatedPlan,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
            variant: "destructive",
            title: "Error Saving Plan",
            description: "Could not save your new study plan.",
        });
    } finally {
        setIsSaving(false);
    }
  }


  if (isLoadingProfiles) {
    return (
        <div className="p-6 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Loading profile...</p>
        </div>
    )
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onGenerate)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mathematics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="curriculum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Curriculum / Syllabus</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Common Core, GCSE" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="educationalMaterials"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Educational Materials</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Algebra 1' textbook, Khan Academy account"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="studyTimePreference"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Preferred Study Times</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Weekday evenings" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="studyDurationPreference"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Preferred Session Duration</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., 45 minutes" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isGenerating || !studentProfile}>
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Generate Plan
            </Button>
          </CardFooter>
        </form>
      </Form>
      {isGenerating && (
         <div className="p-6 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Generating your personalized plan...</p>
         </div>
      )}
      {generatedPlan && (
        <div className="p-6 border-t">
          <h3 className="text-xl font-bold mb-4 font-headline">Your Generated Study Plan</h3>
          <div className="prose prose-sm max-w-none rounded-md border bg-secondary/50 p-4 whitespace-pre-wrap">
            {generatedPlan.studyPlan}
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={onConfirmAndSave} disabled={isSaving}>
                {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                )}
                Confirm and Start Plan
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
