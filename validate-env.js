const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load .env.local
const envConfig = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), '.env.local')));

console.log('--- Environment Validation ---');

// 1. Check Stripe
if (envConfig.STRIPE_SECRET_KEY && envConfig.STRIPE_SECRET_KEY.startsWith('sk_live_')) {
    console.warn('?? WARNING: You are using LIVE Stripe keys. Real charges will occur.');
} else if (envConfig.STRIPE_SECRET_KEY && envConfig.STRIPE_SECRET_KEY.startsWith('sk_test_')) {
    console.log('? Stripe Test Key detected.');
} else {
    console.error('? Invalid Stripe Secret Key format.');
}

// 2. Check Firebase Service Account
try {
    let serviceAccountStr = envConfig.FIREBASE_SERVICE_ACCOUNT_KEY;
    // Remove surrounding quotes if dotenv didn't (dotenv usually does, but let's be safe)
    if (serviceAccountStr.startsWith("'") && serviceAccountStr.endsWith("'")) {
        serviceAccountStr = serviceAccountStr.slice(1, -1);
    }

    const serviceAccount = JSON.parse(serviceAccountStr);
    if (serviceAccount.project_id && serviceAccount.private_key) {
        console.log('? Firebase Service Account JSON parsed successfully.');
        console.log(`   Project ID: ${serviceAccount.project_id}`);
    } else {
        console.error('? Firebase Service Account JSON is missing required fields.');
    }
} catch (error) {
    console.error('? Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', error.message);
    console.log('Raw value length:', envConfig.FIREBASE_SERVICE_ACCOUNT_KEY ? envConfig.FIREBASE_SERVICE_ACCOUNT_KEY.length : 0);
}

// 3. Check Google AI
if (envConfig.GOOGLE_GENAI_API_KEY && envConfig.GOOGLE_GENAI_API_KEY.startsWith('AIza')) {
    console.log('? Google AI API Key detected.');
} else {
    console.error('? Invalid Google AI API Key format.');
}

console.log('--- Validation Complete ---');
