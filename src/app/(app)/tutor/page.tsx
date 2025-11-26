import { TutorForm } from "./tutor-form";

export default function TutorPage() {
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">AI Tutoring Session</h1>
      </div>
      
      <TutorForm />
    </>
  );
}
