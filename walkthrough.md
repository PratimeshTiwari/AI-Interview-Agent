# Interview Agent - Final Walkthrough

## 🚀 Overview
This project is a **Voice-First AI Interview Agent** designed to help users practice for technical interviews. It features a realistic conversational AI, dynamic memory, and a comprehensive dashboard.

## ✨ Key Features

### 1. **Smart Authentication & Onboarding**
- **Login Page**: Sleek, glassmorphic design.
- **Persona Selection**: Choose from dummy profiles (Software Engineer, PM, Sales) to simulate different interview contexts.
- **Auto-Redirect**: Unauthenticated users are automatically redirected to login.

### 2. **Dynamic Dashboard**
- **Stats Overview**: Track your average score and session count.
- **Skill Confidence Chart**: Dynamic bar chart showing your confidence in key areas (React, System Design, etc.).
- **Readiness Tracker**: Visual indicator of your interview readiness (Technical, Behavioral, Speed).
- **Memory Bank**: The AI **learns** about you. If you mention your skills or background during an interview, it saves them here!
- **AI Helper Widget**: A floating chat button powered by **Gemini Flash** to answer quick questions (free & fast).
- **Theme Toggle**: Switch between Dark (default) and Light mode.

### 3. **Immersive Interview Experience**
- **Voice Interaction**: Speak naturally to the agent.
- **Real-time Visualizer**: Dynamic audio bars react to your voice and the AI's voice.
- **Context Aware**: The AI knows your name, role, and resume.
- **Text Fallback**: Keyboard mode available if you prefer typing.
- **End Session**: Saves your progress and returns you to the dashboard.

## 🛠️ Technical Highlights
- **Next.js 14 (App Router)**: Modern, server-side rendered architecture.
- **OpenAI GPT-4o-mini**: Powers the core interview logic.
- **ElevenLabs**: Provides ultra-realistic voice output.
- **Google Gemini**: Powers the Dashboard Helper and serves as a fallback for the main chat.
- **LocalStorage**: Persists user sessions, history, and memories entirely client-side for the demo.

## 🧪 How to Test
1.  **Start**: Run `npm run dev` and go to `http://localhost:3000`.
2.  **Login**: Select "Pratimesh Tiwari" (Software Engineer).
3.  **Explore Dashboard**: Check out the stats, skill chart, and toggle the theme.
4.  **Interview**: Click "Start Session".
    *   Allow microphone access.
    *   Say: *"Hi, I'm Pratimesh. I have 5 years of experience in React."*
    *   Listen to the response.
5.  **Check Memory**: Click "End Session". Look at the **Memory Bank** in the dashboard—it should now list your React experience!

## 📸 Screenshots
*(Add screenshots of Login, Dashboard, and Interview screen here)*
