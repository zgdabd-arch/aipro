
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Activity, BookOpen, Clock, Target, Loader2 } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useMemo } from 'react';
import { format, eachMonthOfInterval, startOfYear, endOfYear } from 'date-fns';

export default function DashboardPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    // Memoize the query for the user's profile
    const studentProfilesQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, `users/${user.uid}/studentProfiles`);
    }, [user, firestore]);

    const { data: studentProfiles, isLoading: isLoadingProfiles } = useCollection(studentProfilesQuery);
    const studentProfile = studentProfiles?.[0];

    // Memoize the query for the latest study plan
    const studyPlanQuery = useMemoFirebase(() => {
        if (!user || !firestore || !studentProfile) return null;
        return query(
            collection(firestore, `users/${user.uid}/studentProfiles/${studentProfile.id}/studyPlans`),
            orderBy('createdAt', 'desc'),
            limit(1)
        );
    }, [user, firestore, studentProfile]);

    const { data: studyPlans, isLoading: isLoadingPlans } = useCollection(studyPlanQuery);
    const latestStudyPlan = studyPlans?.[0];

    // Memoize the query for progress on the latest study plan
    const progressQuery = useMemoFirebase(() => {
        if (!user || !firestore || !studentProfile || !latestStudyPlan) return null;
        return collection(firestore, `users/${user.uid}/studentProfiles/${studentProfile.id}/studyPlans/${latestStudyPlan.id}/progress`);
    }, [user, firestore, studentProfile, latestStudyPlan]);

    const { data: progressData, isLoading: isLoadingProgress } = useCollection(progressQuery);

    const { chartData, totalMinutes, lessonsCompleted } = useMemo(() => {
        const now = new Date();
        const yearStart = startOfYear(now);
        const yearEnd = endOfYear(now);
        
        const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });
        const initialData = months.map(monthDate => ({
            date: format(monthDate, 'MMM'),
            minutes: 0,
        }));

        if (!progressData) {
            return { chartData: initialData, totalMinutes: 0, lessonsCompleted: 0 };
        }

        const uniqueCompletedSessions = new Set<string>();
        
        const { aggregatedData, totalMinutes } = progressData.reduce((acc, progress) => {
            if (!progress.date) return acc;
            const progressDate = progress.date?.toDate ? progress.date.toDate() : new Date(progress.date);
            const month = format(progressDate, 'MMM');
            const sessionMinutes = progress.duration || 0; 
            
            acc.totalMinutes += sessionMinutes;
            const monthIndex = acc.aggregatedData.findIndex(d => d.date === month);
            if (monthIndex > -1) {
                acc.aggregatedData[monthIndex].minutes += sessionMinutes;
            }

            if (progress.studySessionId) {
                uniqueCompletedSessions.add(progress.studySessionId);
            }

            return acc;
        }, { aggregatedData: [...initialData], totalMinutes: 0 });

        return { chartData: aggregatedData, totalMinutes, lessonsCompleted: uniqueCompletedSessions.size };

    }, [progressData]);

    const currentProgress = useMemo(() => {
        if (!latestStudyPlan?.schedule || latestStudyPlan.schedule.length === 0) return 0;
        const totalLessons = latestStudyPlan.schedule.length;
        if (totalLessons === 0) return 0;
        return Math.round((lessonsCompleted / totalLessons) * 100);
    }, [latestStudyPlan, lessonsCompleted]);

    const stats = useMemo(() => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return [
            { title: 'Time Studied', value: `${hours}h ${minutes}m`, icon: Clock, change: 'in total' },
            { title: 'Lessons Completed', value: `${lessonsCompleted}`, icon: BookOpen, change: `of ${latestStudyPlan?.schedule?.length || 0} planned` },
            { title: 'Current Goal', value: latestStudyPlan?.subject || 'N/A', icon: Target, change: 'Latest study plan' },
            { title: 'Active Days', value: new Set(progressData?.map(p => p.date?.toDate ? p.date.toDate().toDateString() : new Date(p.date).toDateString())).size, icon: Activity, change: 'Number of sessions' },
        ];
    }, [totalMinutes, latestStudyPlan, progressData, lessonsCompleted]);

    const isLoading = isLoadingProfiles || isLoadingPlans || isLoadingProgress;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }
  
    return (
      <>
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        </div>
  
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>
  
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Study Activity</CardTitle>
              <CardDescription>Your study minutes over the last year.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}m`}
                  />
                   <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Bar dataKey="minutes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
  
          <Card className="col-span-4 lg:col-span-3">
            <CardHeader>
              <CardTitle>Current Goal Progress</CardTitle>
              <CardDescription>{latestStudyPlan?.subject ? `Progress on ${latestStudyPlan.subject}` : 'No active study plan'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {latestStudyPlan && latestStudyPlan.schedule ? (
                    <div>
                        <div className="mb-2 flex justify-between">
                            <span className="text-sm font-medium">Overall Progress</span>
                            <span className="text-sm font-medium text-muted-foreground">{currentProgress}%</span>
                        </div>
                        <Progress value={currentProgress} aria-label={`${currentProgress}% progress on current goal`} />
                        <div className="text-sm text-muted-foreground mt-4">
                            <p>You're making great progress. Keep up the momentum!</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground">
                        <p>No study plan has been generated yet.</p>
                        <p className="text-sm">Go to the "Study Plan" page to create one.</p>
                    </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }
  