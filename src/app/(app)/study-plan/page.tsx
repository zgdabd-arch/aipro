
import { StudyPlanForm } from "./study-plan-form";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function StudyPlanPage() {
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Personalized Study Plan</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Generate Your Plan</CardTitle>
          <CardDescription>Fill in the details below to create a study plan tailored just for you.</CardDescription>
        </CardHeader>
        <StudyPlanForm />
      </Card>
    </>
  );
}
