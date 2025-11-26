
'use server';

/**
 * @fileOverview AI-powered tutoring tool that provides personalized explanations and examples based on the student's study plan and conversation history.
 *
 * - aiTutoringTool - A function that offers AI-powered assistance.
 * - AiTutoringToolInput - The input type for the aiTutoringTool function.
 * - AiTutoringToolOutput - The return type for the aiTutoringTool function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { textToSpeech } from './tts-flow';

const ChatMessageSchema = z.object({
  user: z.string().optional(),
  model: z.string().optional(),
});

const AiTutoringToolInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  gradeLevel: z.string().describe('The grade level of the student.'),
  country: z.string().describe('The country of the student.'),
  preferredLearningLanguage: z
    .string()
    .describe('The preferred language for learning.'),
  subject: z.string().describe('The subject the student wants to improve in.'),
  topic: z.string().describe('The specific topic for the current study session. Can be "General Question" if no specific topic is scheduled.'),
  studyPlan: z.string().optional().describe('The overall study plan for the student. Use this for broad context.'),
  fileDataUri: z.string().optional().describe(
    "An optional file (image or document) provided by the student, as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
  history: z.array(ChatMessageSchema).describe('The conversation history between the user and the model.'),
  question: z.string().describe('The latest question from the student.'),
});
export type AiTutoringToolInput = z.infer<typeof AiTutoringToolInputSchema>;

const AiTutoringToolOutputSchema = z.object({
  explanation: z
    .string()
    .describe(
      'A personalized explanation of the topic, tailored to the student and their study plan.'
    ),
  example: z
    .string()
    .describe(
      'A relevant example to illustrate the topic, customized for the student and their study plan.'
    ),
  explanationAudio: z
    .string()
    .describe('The audio data URI for the explanation.'),
  exampleAudio: z
    .string()
    .describe('The audio data URI for the example.'),
});
export type AiTutoringToolOutput = z.infer<typeof AiTutoringToolOutputSchema>;

export async function aiTutoringTool(
  input: AiTutoringToolInput
): Promise<AiTutoringToolOutput> {
  return aiTutoringToolFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiTutoringToolPrompt',
  input: {schema: z.object({
    isGeneralQuestion: z.boolean(),
    studentName: z.string(),
    gradeLevel: z.string(),
    country: z.string(),
    preferredLearningLanguage: z.string(),
    subject: z.string(),
    topic: z.string(),
    studyPlan: z.string().optional(),
    fileDataUri: z.string().optional(),
    history: z.array(ChatMessageSchema),
    question: z.string(),
  })},
  output: {schema: z.object({
      explanation: z.string().describe(
        'A personalized explanation of the topic, tailored to the student and their study plan.'
      ),
      example: z.string().describe(
        'A relevant example to illustrate the topic, customized for the student and their study plan.'
      ),
  })},
  prompt: `You are an AI Professor specializing in personalized education.

  {{#if isGeneralQuestion}}
  You are in a general session. The student does not have a specific topic scheduled. Your goal is to be a helpful academic assistant. Answer the student's question clearly and provide a relevant example. Tailor your response to the student's profile.
  {{else}}
  You are in a focused lesson. Your primary goal is to provide a clear explanation and a relevant example for the student's current topic: "{{{topic}}}". **Crucially, you MUST focus your response on this specific topic.**
  {{/if}}

  Tailor the explanation and example to the student's specific needs, considering their profile and question.

  {{#if fileDataUri}}
  The student has uploaded a file with their latest question. You MUST analyze the contents of this file and use it as the primary context for your answer, relating it back to the main topic if one is active.
  File: {{media url=fileDataUri}}
  {{/if}}
  
  You must consider the conversation history to provide context and ensure your answer helps them progress. The overall study plan is for broad context.

  Student Details:
  - Name: {{{studentName}}}
  - Grade Level: {{{gradeLevel}}}
  - Country: {{{country}}}
  - Preferred Language: {{{preferredLearningLanguage}}}

  Current Lesson Details:
  - Subject: {{{subject}}}
  - Topic: {{{topic}}}

  {{#if studyPlan}}
  Overall Study Plan Context (for reference):
  ---
  {{{studyPlan}}}
  ---
  {{/if}}

  Conversation History:
  {{#each history}}
    {{#if this.user}}
      Student: {{{this.user}}}
    {{/if}}
    {{#if this.model}}
      Professor: {{{this.model}}}
    {{/if}}
  {{/each}}

  Latest Student Question: {{{question}}}

  Based on all this information, provide a clear explanation and a relevant example for the student's question.
  `,
});

const aiTutoringToolFlow = ai.defineFlow(
  {
    name: 'aiTutoringToolFlow',
    inputSchema: AiTutoringToolInputSchema,
    outputSchema: AiTutoringToolOutputSchema,
  },
  async (input) => {
    // Step 1: Get the text-based explanation and example from the main prompt.
    const { output: textOutput } = await prompt({
        ...input,
        isGeneralQuestion: input.topic === 'General Question',
    });
    if (!textOutput) {
      throw new Error('Failed to get a text response from the AI.');
    }

    // Step 2: Concurrently generate audio for both the explanation and the example.
    const [explanationAudioResult, exampleAudioResult] = await Promise.all([
        textToSpeech(textOutput.explanation),
        textToSpeech(textOutput.example)
    ]);

    if (!explanationAudioResult || !exampleAudioResult) {
        throw new Error('Failed to generate audio for the explanation or example.');
    }

    // Step 3: Combine the text output with the generated audio URIs into the final response.
    return {
      explanation: textOutput.explanation,
      example: textOutput.example,
      explanationAudio: explanationAudioResult.audio,
      exampleAudio: exampleAudioResult.audio,
    };
  }
);
