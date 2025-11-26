# Environment Variables Quick Reference

## Required Variables

| Variable | Purpose | Where to Get It |
|----------|---------|-----------------|
| `STRIPE_SECRET_KEY` | Stripe server-side API key | [Stripe Dashboard → API Keys](https://dashboard.stripe.com/apikeys) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe client-side API key | [Stripe Dashboard → API Keys](https://dashboard.stripe.com/apikeys) |
| `STRIPE_WEBHOOK_SECRET` | Verify Stripe webhook signatures | [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase client authentication | Firebase Console → Project Settings → General |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Firebase Console → Project Settings → General |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project identifier | Firebase Console → Project Settings → General |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Firebase Console → Project Settings → General |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging ID | Firebase Console → Project Settings → General |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app identifier | Firebase Console → Project Settings → General |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Firebase analytics ID | Firebase Console → Project Settings → General |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Firebase Admin SDK credentials | Firebase Console → Service Accounts → Generate Key |
| `GOOGLE_GENAI_API_KEY` | Google AI/Genkit API access | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `NEXT_PUBLIC_APP_URL` | Application base URL | `http://localhost:9002` (dev) or your domain (prod) |

## Setup Status Checklist

- [ ] Created `.env.local` file in project root
- [ ] Added Stripe API keys (test mode)
- [ ] Set up Stripe webhook endpoint
- [ ] Added Firebase client configuration
- [ ] Generated and added Firebase service account key
- [ ] Added Google AI API key
- [ ] Set application URL
- [ ] Restarted development server

## Quick Commands

```bash
# Create .env.local from template (already done)
# The file is located at: c:\Users\Usuario\Desktop\AiPro\project\.env.local

# Test Stripe CLI webhook forwarding (for local development)
stripe listen --forward-to localhost:9002/api/stripe/webhook

# Start development server
npm run dev

# Verify environment variables are loaded
# Check the console output when starting the dev server
```

## Important Notes

- ✅ `.env.local` is already in `.gitignore` - it won't be committed
- ✅ Use **test mode** keys during development (prefix: `sk_test_`, `pk_test_`)
- ✅ For production deployment, set these in your hosting platform's environment variables
- ⚠️ Never share or commit your secret keys
- ⚠️ The `FIREBASE_SERVICE_ACCOUNT_KEY` must be a single-line JSON string

## Next Steps

1. Open `c:\Users\Usuario\Desktop\AiPro\project\.env.local`
2. Replace all placeholder values with your actual credentials
3. Follow the detailed instructions in [ENV_SETUP.md](./ENV_SETUP.md)
4. Restart your development server after updating the file
