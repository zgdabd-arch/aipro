
'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Loader2 } from "lucide-react"
import { useUser, useFirestore, errorEmitter } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { FirestorePermissionError } from "@/firebase/errors";
import { createCheckoutSession } from "@/ai/flows/create-checkout-session";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const tiers = [
  {
    name: "Free",
    price: "$0",
    frequency: "/month",
    description: "Get started with the basics.",
    features: [
      "10 AI Tutor questions/month",
      "1 Personalized Study Plan/month",
      "Basic Progress Tracking",
    ],
    cta: "Current Plan",
    isCurrent: false, // This will be dynamic
    isPro: false,
    subscriptionValue: "free",
  },
  {
    name: "Pro",
    price: "€10",
    frequency: "/month",
    description: "Unlock your full potential.",
    features: [
      "Unlimited AI Tutor questions",
      "Unlimited Personalized Study Plans",
      "Advanced Progress Tracking",
      "Priority Support",
    ],
    cta: "Upgrade to Pro",
    isCurrent: false, // This will be dynamic
    isPro: true,
    subscriptionValue: "pro",
  },
];

export default function BillingPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const currentSubscription = user?.profile?.subscriptionStatus || 'free';

  const handleUpgrade = async () => {
     if (!user?.email) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to upgrade.',
      });
      return;
    }
    setIsUpgrading(true);

    try {
        const redirectUrl = window.location.href;
        const { sessionId } = await createCheckoutSession({
            userId: user.uid,
            userEmail: user.email,
            redirectUrl: redirectUrl,
        });

        const stripe = await stripePromise;
        if (!stripe) {
            throw new Error("Stripe.js has not loaded yet.");
        }
        
        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
            throw new Error(error.message);
        }

    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Upgrade Failed",
            description: error.message || "Could not initiate the upgrade process. Please try again.",
        });
    } finally {
        setIsUpgrading(false);
    }
  }


  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Billing & Subscriptions</h1>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {tiers.map((tier) => {
          const isCurrent = tier.subscriptionValue === currentSubscription;
          return (
            <Card key={tier.name} className={`flex flex-col ${isCurrent ? 'border-primary ring-2 ring-primary' : ''}`}>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div>
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground">{tier.frequency}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-accent" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                  <Button 
                    className="w-full" 
                    disabled={isCurrent || isUpgrading}
                    onClick={tier.isPro ? handleUpgrade : undefined}
                  >
                        {isUpgrading && tier.isPro ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isCurrent ? "Current Plan" : tier.cta}
                  </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </>
  )
}
