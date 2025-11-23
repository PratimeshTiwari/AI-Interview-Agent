# System Design & Architecture

## 🧠 AI System Prompts

The core of the **AI Interview Agent's** intelligence lies in its carefully crafted system prompts. These prompts define the persona, behavior, and evaluation criteria for the AI interviewer.

### Interviewer Persona (Gemini)
The AI acts as a "Senior Technical Interviewer" at a top-tier tech company.
*   **Tone**: Professional, encouraging, yet rigorous.
*   **Goal**: Assess the candidate's technical depth, problem-solving skills, and communication.
*   **Phases**:
    1.  **Introduction**: Ice-breaking and role confirmation.
    2.  **Discovery**: Experience walkthrough and project deep dives.
    3.  **Technical Deep Dive**: Core technical concepts (e.g., React lifecycle, Database indexing).
    4.  **Coding Challenge**: A practical coding problem (if applicable).
    5.  **Conclusion**: Wrap-up and candidate questions.

### System Prompt Structure
```text
You are an expert technical interviewer for the role of {role}.
Your goal is to assess the candidate's skills in {skills}.

GUIDELINES:
- Ask one question at a time.
- Be concise (max 2-3 sentences).
- Dig deeper if the answer is vague.
- Move to the next topic if the candidate demonstrates mastery.
- Maintain a professional but friendly tone.

PHASES:
[...detailed phase descriptions...]
```

## 🛡️ Guardrails & Integrity

To ensure a fair and effective interview, the system implements several guardrails:

### 1. Silence Detection
*   **Mechanism**: The `useSpeechRecognition` hook monitors audio input levels.
*   **Trigger**: If silence persists for >5 seconds while "listening", the system prompts the user or auto-submits the current transcript.
*   **Action**: "I noticed you're quiet. Do you need a moment or should I rephrase the question?"

### 2. Irrelevance Detection
*   **Mechanism**: The AI evaluates the semantic relevance of the user's response to the current question.
*   **Trigger**: Response similarity score < Threshold (conceptually handled by LLM).
*   **Action**: The AI redirects: "That's interesting, but could you clarify how it relates to [Topic]?"

### 3. Anti-Cheating (Plagiarism Check)
*   **Mechanism**: (Planned) Comparison of code submissions against known solutions or detection of copy-paste events (large text blocks inserted instantly).
*   **Current State**: The coding workspace monitors typing speed and paste events.

## 📊 Scoring System

The scoring logic is multi-dimensional, evaluating the candidate on:

1.  **Technical Accuracy (40%)**: Correctness of facts and code.
2.  **Communication (30%)**: Clarity, structure, and conciseness.
3.  **Problem Solving (30%)**: Approach to unknown problems and debugging.

### Scoring Rubric (Backend)
The `/api/summary` endpoint uses a specific rubric to generate the final score (0-100%):

*   **0-30% (Fail)**:
    *   No answer or "I don't know" to basic questions.
    *   Completely irrelevant responses.
    *   Significant factual errors.
*   **31-60% (Needs Improvement)**:
    *   Vague or surface-level answers.
    *   Correct concepts but poor explanation.
    *   Struggles with follow-up questions.
*   **61-85% (Pass)**:
    *   Clear, accurate answers.
    *   Good examples and context.
    *   Solid coding implementation.
*   **86-100% (Strong Hire)**:
    *   Deep technical insight (trade-offs, internals).
    *   Exceptional communication.
    *   Optimized and clean code solutions.

## 🔄 Data Flow Diagram

```mermaid
graph TD
    User[User (Voice/Text)] -->|Input| Client[Next.js Client]
    Client -->|STT| Transcript[Text Transcript]
    Transcript -->|POST /api/chat| API[API Route]
    API -->|Prompt + Context| LLM[Gemini Pro]
    LLM -->|Response + Metadata| API
    API -->|JSON| Client
    Client -->|TTS| Audio[Audio Output]
    Client -->|Update UI| UI[Orb / HUD / Code]
    
    subgraph "State Management"
        Client <-->|Read/Write| LocalStorage[Browser Storage]
    end
```
