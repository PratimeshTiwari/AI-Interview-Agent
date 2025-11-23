# Deployment Guide

This guide will help you deploy your EightFold application to the internet using Vercel, the creators of Next.js.

## Prerequisites

1.  A [GitHub](https://github.com/) account.
2.  A [Vercel](https://vercel.com/) account (you can sign up with GitHub).
3.  Your project code pushed to a GitHub repository.

## Step 1: Push Code to GitHub

If you haven't already, initialize a git repository and push your code:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/PratimeshTiwari/eightfold.git
git push -u origin main
```

## Step 2: Deploy to Vercel

1.  Go to the [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `eightfold` repository from GitHub.
4.  In the **Configure Project** screen:
    *   **Framework Preset**: Next.js (should be auto-detected).
    *   **Root Directory**: `./` (default).
    *   **Environment Variables**: Add the keys from your `.env.local` file:
        *   `GEMINI_API_KEY`
        *   `NEXT_PUBLIC_ELEVENLABS_API_KEY` (if using ElevenLabs)
        *   `OPENAI_API_KEY` (if using OpenAI fallback)

5.  Click **"Deploy"**.

## Step 3: Verify Deployment

Vercel will build your project. Once complete (usually 1-2 minutes), you will get a live URL (e.g., `https://eightfold-app.vercel.app`).

*   **Test Login**: Ensure you can log in as "Pratimesh Tiwari".
*   **Test Interview**: Grant microphone permissions and try a session.
*   **Test Dashboard**: Verify analytics load correctly.

## Troubleshooting

*   **Build Errors**: Check the "Logs" tab in Vercel. Common issues include TypeScript errors (run `npm run lint` locally to check).
*   **API Issues**: If the AI doesn't respond, double-check your `GEMINI_API_KEY` in the Vercel project settings.
*   **Audio Issues**: Ensure your browser allows microphone access for the deployed domain.

## Custom Domain (Optional)

To use a custom domain (e.g., `pratimesh.com`):
1.  Go to your Project Settings -> **Domains**.
2.  Enter your domain name.
3.  Follow the DNS configuration instructions provided by Vercel.
