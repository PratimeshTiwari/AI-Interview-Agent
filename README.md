# EightFold - AI Interview Agent

EightFold is an advanced AI-powered interview practice platform designed to simulate real-world technical interviews. It features a conversational AI agent, real-time feedback, coding workspace, and detailed performance analytics.

## 🚀 Features

*   **Immersive Interview Experience**: Real-time voice interaction with an AI interviewer.
*   **Adaptive Questioning**: The AI adapts questions based on your responses and role (e.g., Software Engineer).
*   **Coding Workspace**: Integrated code editor for technical questions with syntax highlighting and multi-language support.
*   **Real-time Feedback**: Instant feedback on your answers, including strengths and areas for improvement.
*   **Dashboard Analytics**: Track your progress with skill confidence charts, readiness trackers, and detailed session history.
*   **Memory Bank**: The AI remembers context from previous sessions to provide a personalized experience.
*   **Guardrails & Anti-Cheating**: Mechanisms to detect silence, irrelevant answers, and ensure interview integrity.

## 🛠️ Tech Stack

*   **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Framer Motion
*   **AI/LLM**: Google Gemini Pro (via Vercel AI SDK)
*   **Voice/Audio**: Web Speech API (STT), ElevenLabs/OpenAI (TTS), Custom Audio Visualizer
*   **State Management**: React Context / Local Storage
*   **Icons**: Lucide React

## 📦 Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/PratimeshTiwari/eightfold.git
    cd eightfold
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env.local` file in the root directory and add the following keys:
    ```env
    GEMINI_API_KEY=your_gemini_api_key
    NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_key (Optional)
    OPENAI_API_KEY=your_openai_key (Optional for TTS fallback)
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Navigate to `http://localhost:3000` in your browser.

## 🏗️ Architecture Overview

The application follows a modern Next.js architecture with a focus on client-side interactivity for the interview session and server-side API routes for AI processing.

### Key Components

*   **`src/app/interview/page.tsx`**: The core interview session component. Handles voice input, AI response generation, state management (listening, speaking, processing), and UI rendering (Orb, Kernel HUD, Coding Workspace).
*   **`src/app/dashboard/page.tsx`**: User dashboard for analytics and history.
*   **`src/app/api/chat/route.ts`**: Main API route for handling chat interactions. Interfaces with Gemini to generate responses based on the conversation history and system prompt.
*   **`src/app/api/summary/route.ts`**: Generates a structured summary and score after the interview concludes.
*   **`src/hooks/useSpeechRecognition.ts`**: Custom hook for managing Web Speech API interactions, including silence detection.

### Data Flow

1.  **User Input**: Voice is captured via microphone -> Transcribed to text (STT).
2.  **Processing**: Text is sent to `/api/chat` -> Gemini processes input with context -> Returns text response + metadata (phase, feedback).
3.  **Output**: Text response is converted to audio (TTS) -> Played to user -> UI updates (Orb animation, Subtitles).
4.  **Storage**: Session data (logs, scores) is saved to `localStorage` for persistence across sessions.

## 🎨 Design Decisions

*   **Dark Mode First**: A sleek, dark-themed UI (Cyberpunk/Sci-Fi aesthetic) was chosen to reduce eye strain and create an immersive "hacker" vibe.
*   **Client-Side Logic**: Heavy reliance on client-side state for the interview session to ensure low latency for voice interactions and UI updates.
*   **Fallback Mechanisms**: Implemented fallbacks for TTS (ElevenLabs -> OpenAI -> Browser) to ensure reliability.
*   **Modular Components**: UI elements like `AIOrb`, `KernelHUD`, and `CodingWorkspace` are separated for maintainability.

## 🛡️ Guardrails & Scoring

*   **Silence Detection**: Automatically nudges the user if no input is detected for a set duration.
*   **Relevance Check**: The AI evaluates if the user's answer is relevant to the question. Irrelevant answers receive a low score.
*   **Scoring Logic**:
    *   **0%**: No meaningful response or completely irrelevant.
    *   **<50%**: Vague or surface-level answers.
    *   **>80%**: Detailed, technical, and well-structured responses.

## 📝 License

MIT License
