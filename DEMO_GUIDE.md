# Verification & Demo Walkthrough

## 1. Pre-Flight Check
- [ ] Ensure `.env.local` has valid API keys (`GEMINI_API_KEY`, etc.).
- [ ] Run `npm run dev`.
- [ ] Open `http://localhost:3000` in Chrome (best for Speech Recognition).

## 2. Demo Scenarios (for Video)

### Scenario A: The "Happy Path" (Technical Interview)
1.  **Login**: Select **"Pratimesh Tiwari"** (Software Engineer).
2.  **Dashboard Tour**:
    *   Show off the **Skill Confidence Chart** (animating bars).
    *   Point out the **Readiness Tracker** ("Strong", "Needs Practice").
    *   Toggle the **Theme** (Sun/Moon icon) to show Light/Dark mode.
3.  **Start Interview**: Click "Start Session".
4.  **Interaction**:
    *   **User**: "Hi, I'm Pratimesh. I have 5 years of experience in React and Next.js."
    *   **AI**: Introduces itself and asks a React question (e.g., "Explain the Virtual DOM" or "useEffect").
    *   **User**: Give a good technical answer.
    *   **Kernel HUD**: Open the HUD (left side) to show the AI analyzing your answer ("Confident", "Strong").
5.  **Coding Challenge**:
    *   Ask the AI: "Can we do a coding problem?"
    *   **Action**: The **Code Editor** should slide in.
    *   **Action**: Drag the handle to resize the editor.
    *   **User**: Type some code (or pseudo-code).

### Scenario B: The "Behavioral" Check
1.  **Interaction**:
    *   **AI**: Asks about a conflict or challenge.
    *   **User**: "I once disagreed with a PM about a deadline..."
    *   **Kernel HUD**: Show the log updating with "Behavioral Analysis".

### Scenario C: The "Edge Case" (Silence/Irrelevance)
1.  **Silence**: Stay silent for 5+ seconds.
    *   **Result**: AI should nudge: "I noticed you're quiet..."
2.  **Irrelevance**: "I want to order a pizza."
    *   **Result**: AI steers back: "Let's focus on your engineering skills."

## 3. Post-Interview
1.  **End Session**: Click "End Session".
2.  **Summary**: Show the "Session Summary" modal with the score.
3.  **Dashboard Update**: Show the **Memory Bank** updated with new skills mentioned during the chat.


