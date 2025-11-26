
'use server';

/**
 * @fileOverview Personalized study plan generation flow.
 *
 * Generates a customized study plan based on student profile and subject.
 * - generateStudyPlan - The function to generate the study plan.
 * - StudyPlanInput - Input type for generateStudyPlan.
 * - StudyPlanOutput - Output type for generateStudyPlan.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { v4 as uuidv4 } from 'uuid';

const StudyPlanInputSchema = z.object({
  name: z.string().describe("Student's name."),
  age: z.number().describe("Student's age."),
  gradeLevel: z.string().describe("Student's grade level."),
  country: z.string().describe("Student's country."),
  preferredLearningLanguage: z.string().describe("Student's preferred learning language."),
  subject: z.string().describe('The subject to create a study plan for.'),
  curriculum: z.string().describe('The curriculum the student is following.'),
  educationalMaterials: z.string().describe('Any educational materials the student has access to.'),
  studyTimePreference: z.string().describe("The student's preferred time for studying (e.g., evenings, weekends)."),
  studyDurationPreference: z.string().describe("The student's preferred duration for each study session (e.g., 30 minutes, 1 hour)."),
});
export type StudyPlanInput = z.infer<typeof StudyPlanInputSchema>;

const StudySessionSchema = z.object({
    id: z.string().describe("A unique identifier for this study session."),
    topic: z.string().describe("The specific topic for this study session."),
    date: z.string().describe("The date for the session in YYYY-MM-DD format."),
    time: z.string().describe("The start time for the session in HH:MM (24-hour) format."),
    duration: z.number().describe("The duration of the session in minutes."),
    learningObjective: z.string().describe("The goal for this study session."),
    activity: z.string().describe("The suggested activity for this session."),
});

const StudyPlanOutputSchema = z.object({
  studyPlan: z.string().describe('The generated personalized study plan as a human-readable text.'),
  schedule: z.array(StudySessionSchema).describe("A structured array of study sessions."),
});
export type StudyPlanOutput = z.infer<typeof StudyPlanOutputSchema>;

export async function generateStudyPlan(input: StudyPlanInput): Promise<StudyPlanOutput> {
  return generateStudyPlanFlow(input);
}

const studyPlanPrompt = ai.definePrompt({
  name: 'studyPlanPrompt',
  input: {schema: StudyPlanInputSchema},
  output: {schema: StudyPlanOutputSchema},
  prompt: `You are an expert educational planner, skilled in creating realistic and effective study schedules with a real, focused pedagogical approach.

  Your task is to generate a detailed, actionable, and personalized study plan.

  First, understand the student's needs based on their profile:
  - Student Name: {{{name}}}
  - Age: {{{age}}}
  - Grade Level: {{{gradeLevel}}}
  - Country: {{{country}}}
  - Preferred Learning Language: {{{preferredLearningLanguage}}}

  Next, consider the learning context:
  - Subject: {{{subject}}}
  - Curriculum: {{{curriculum}}}
  - Educational Materials: {{{educationalMaterials}}}

  Finally, and most importantly, structure the study plan as a detailed schedule based on the student's availability and preferences:
  - Preferred Study Times: {{{studyTimePreference}}}
  - Preferred Session Duration: {{{studyDurationPreference}}}

  You must generate two things:
  1. A 'studyPlan' which is a human-readable, detailed, and actionable study plan tailored to the student's needs. The plan should be broken down into a weekly or daily schedule. For each session, specify the topic, the learning objective, and a suggested activity (e.g., "Read Chapter 3 of 'Algebra 1' textbook," "Complete 10 practice problems on Khan Academy," "Review notes on cellular respiration"). The study plan must be in the student's preferred learning language. The plan must be structured, realistic, and designed to help the student make tangible progress in the targeted subject.

  2. A 'schedule' which is a machine-readable JSON array of study session objects. Each object in the array must conform to the output schema, containing the topic, date (YYYY-MM-DD), time (HH:MM), duration (in minutes), learningObjective, and activity for each session. Base the schedule on the current date. Do NOT add the id field, it will be added later.
`,
});

const generateStudyPlanFlow = ai.defineFlow(
  {
    name: 'generateStudyPlanFlow',
    inputSchema: StudyPlanInputSchema,
    outputSchema: StudyPlanOutputSchema,
  },
  async input => {
    const {output} = await studyPlanPrompt(input);

    if (!output) {
      throw new Error("Failed to generate study plan.");
    }
    
    // Add unique IDs to each session in the schedule
    const scheduleWithIds = output.schedule.map(session => ({
      ...session,
      id: uuidv4(),
    }));

    return {
      studyPlan: output.studyPlan,
      schedule: scheduleWithIds,
    };
  }
);
