# Environment Variables Setup Guide

This guide will help you set up all the required environment variables for the application.

## Quick Setup

1. Create a `.env.local` file in the project root directory
2. Copy the template below and replace the placeholder values with your actual credentials
3. Restart your development server after adding the variables

## Environment Variables Template

```bash
# Stripe Configuration
# Get these from: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Stripe Webhook Secret
# Get this from: https://dashboard.stripe.com/webhooks
# After creating a webhook endpoint pointing to: https://yourdomain.com/api/stripe/webhook
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Firebase Configuration (Client-side)
# Get these from: Firebase Console > Project Settings > General > Your apps > SDK setup and configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Firebase Admin SDK (Server-side)
# Get this from: Firebase Console > Project Settings > Service Accounts > Generate new private key
# IMPORTANT: This should be the entire JSON content as a single-line string
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}

# Google AI (Genkit)
# Get this from: https://aistudio.google.com/app/apikey
GOOGLE_GENAI_API_KEY=your_google_genai_api_key_here

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:9002
```

## Detailed Setup Instructions

### 1. Stripe Configuration

#### Get Stripe API Keys:
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Sign in or create an account
3. Copy your **Secret key** (starts with `sk_test_` for test mode)
4. Copy your **Publishable key** (starts with `pk_test_` for test mode)

#### Set up Stripe Webhook:
1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://yourdomain.com/api/stripe/webhook` (or use ngrok for local testing)
4. Select events to listen to: `checkout.session.completed`
5. Copy the **Signing secret** (starts with `whsec_`)

**For local development with webhooks:**
```bash
# Install Stripe CLI
stripe listen --forward-to localhost:9002/api/stripe/webhook
# This will give you a webhook secret for local testing
```

### 2. Firebase Configuration

#### Get Firebase Client Config:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the gear icon ⚙️ > **Project settings**
4. Scroll down to **Your apps** section
5. If you haven't added a web app, click the web icon `</>` to add one
6. Copy all the config values from the `firebaseConfig` object

#### Get Firebase Admin SDK Key:
1. In Firebase Console, go to **Project settings** > **Service accounts**
2. Click **Generate new private key**
3. Download the JSON file
4. **Convert the JSON to a single-line string** (remove newlines and spaces)
5. Paste the entire JSON string as the value for `FIREBASE_SERVICE_ACCOUNT_KEY`

**Example conversion:**
```bash
# Original JSON file (firebase-adminsdk.json):
{
  "type": "service_account",
  "project_id": "my-project",
  ...
}

# Convert to single line (you can use online tools or this command):
cat firebase-adminsdk.json | jq -c
```

### 3. Google AI (Genkit) Configuration

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy the API key

### 4. Application URL

For local development:
```bash
NEXT_PUBLIC_APP_URL=http://localhost:9002
```

For production, replace with your actual domain:
```bash
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Verification

After setting up your `.env.local` file, verify it's working:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Check the console for any errors related to missing environment variables

3. Test the Stripe integration by attempting a checkout

4. Test Firebase by checking authentication and database operations

## Security Notes

- ⚠️ **NEVER commit `.env.local` to version control**
- ⚠️ The `.gitignore` file already excludes `.env*` files
- ⚠️ Keep your `STRIPE_SECRET_KEY` and `FIREBASE_SERVICE_ACCOUNT_KEY` secure
- ⚠️ Use test mode keys (`sk_test_`, `pk_test_`) during development
- ⚠️ For production, use environment variables in your hosting platform (Vercel, Netlify, etc.)

## Troubleshooting

### Stripe webhook not working locally:
- Use the Stripe CLI to forward webhooks to localhost
- Or use a tool like [ngrok](https://ngrok.com/) to expose your local server

### Firebase Admin SDK errors:
- Ensure the JSON is properly formatted as a single-line string
- Check that the service account has the necessary permissions
- Verify the project ID matches your Firebase project

### Google AI API errors:
- Ensure you've enabled the Generative AI API in Google Cloud Console
- Check that your API key is valid and not restricted
