
'use client';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUser, useFirestore, useMemoFirebase, errorEmitter } from "@/firebase"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { doc, collection, setDoc } from "firebase/firestore"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useCollection } from '@/firebase';
import { FirestorePermissionError } from "@/firebase/errors"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.coerce.number().min(1, "Age is required"),
  gradeLevel: z.string().min(1, "Grade level is required"),
  country: z.string().min(1, "Country is required"),
  preferredLearningLanguage: z.string().min(1, "Language is required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const studentProfilesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/studentProfiles`);
  }, [user, firestore]);

  const { data: studentProfiles, isLoading: isLoadingProfiles } = useCollection(studentProfilesQuery);
  
  const studentProfile = studentProfiles?.[0];

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      age: 0,
      gradeLevel: "",
      country: "",
      preferredLearningLanguage: "english",
    },
  });

  useEffect(() => {
    if (studentProfile) {
      form.reset({
        name: studentProfile.name,
        age: studentProfile.age,
        gradeLevel: studentProfile.gradeLevel,
        country: studentProfile.country,
        preferredLearningLanguage: studentProfile.preferredLearningLanguage,
      });
    } else if (user?.displayName && !form.getValues().name) {
        form.setValue('name', user.displayName);
    }
  }, [studentProfile, user, form]);
  
  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  const onSubmit = async (data: ProfileFormData) => {
    if (!user || !firestore) return;

    setIsSaving(true);
    form.clearErrors();

    const profileId = studentProfile?.id || doc(collection(firestore, '_')).id;
    const profileRef = doc(firestore, `users/${user.uid}/studentProfiles`, profileId);

    const profileData = {
      ...data,
      id: profileId,
      userId: user.uid,
    };

    setDoc(profileRef, profileData, { merge: true }).then(() => {
        toast({
            title: "Profile Saved",
            description: "Your information has been updated successfully.",
        });
    }).catch(error => {
        console.error("Error saving profile:", error);
        const permissionError = new FirestorePermissionError({
            path: profileRef.path,
            operation: studentProfile ? 'update' : 'create',
            requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not save your profile. Please check permissions and try again.",
        });
    }).finally(() => {
        setIsSaving(false);
    });
  };

  if (isLoadingProfiles || isUserLoading) {
    return (
        <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  return (
    <>
        <div className="flex items-center justify-between space-y-2">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Student Profile</h1>
        </div>
        <Card>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle>Your Information</CardTitle>
                    <CardDescription>
                    Update your profile to keep your learning experience personalized.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-6 mb-8">
                     <div className="relative">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                          <AvatarFallback className="text-3xl">
                            {getInitials(user?.displayName)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                  </div>
                    <div className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...form.register("name")} />
                        {form.formState.errors.name && <p className="text-destructive text-sm">{form.formState.errors.name.message}</p>}
                        </div>
                        <div className="grid gap-2">
                        <Label htmlFor="age">Age</Label>
                        <Input id="age" type="number" {...form.register("age")} />
                        {form.formState.errors.age && <p className="text-destructive text-sm">{form.formState.errors.age.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="grade-level">Grade Level</Label>
                            <Input id="grade-level" {...form.register("gradeLevel")} />
                            {form.formState.errors.gradeLevel && <p className="text-destructive text-sm">{form.formState.errors.gradeLevel.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" {...form.register("country")} />
                            {form.formState.errors.country && <p className="text-destructive text-sm">{form.formState.errors.country.message}</p>}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="language">Preferred Learning Language</Label>
                        <Select value={form.watch("preferredLearningLanguage")} onValueChange={(value) => form.setValue("preferredLearningLanguage", value)}>
                        <SelectTrigger id="language">
                            <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="spanish">Spanish</SelectItem>
                            <SelectItem value="french">French</SelectItem>
                            <SelectItem value="german">German</SelectItem>
                            <SelectItem value="mandarin">Mandarin</SelectItem>
                        </SelectContent>
                        </Select>
                        {form.formState.errors.preferredLearningLanguage && <p className="text-destructive text-sm">{form.formState.errors.preferredLearningLanguage.message}</p>}
                    </div>
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button type="submit" disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </CardFooter>
            </form>
        </Card>
    </>
  )
}
