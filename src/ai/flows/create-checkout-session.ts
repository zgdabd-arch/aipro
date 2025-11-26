
'use server';

import { z } from 'genkit';
import Stripe from 'stripe';

const CreateCheckoutSessionInputSchema = z.object({
  userId: z.string().describe("The user's unique ID."),
  userEmail: z.string().email().describe("The user's email address."),
  redirectUrl: z.string().url().describe("The URL to redirect to after payment."),
});
export type CreateCheckoutSessionInput = z.infer<typeof CreateCheckoutSessionInputSchema>;

const CreateCheckoutSessionOutputSchema = z.object({
  sessionId: z.string().describe("The ID of the Stripe Checkout Session."),
});
export type CreateCheckoutSessionOutput = z.infer<typeof CreateCheckoutSessionOutputSchema>;


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
});

const proPriceId = process.env.STRIPE_PRO_PRICE_ID!;

export async function createCheckoutSession(
  input: CreateCheckoutSessionInput
): Promise<CreateCheckoutSessionOutput> {
    const { userId, userEmail, redirectUrl } = CreateCheckoutSessionInputSchema.parse(input);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: proPriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${redirectUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: redirectUrl,
      client_reference_id: userId, // Pass the user's ID to the session
      customer_email: userEmail, // Pre-fill the user's email
    });

    if (!session.id) {
        throw new Error("Failed to create Stripe checkout session.");
    }

    return { sessionId: session.id };
}
