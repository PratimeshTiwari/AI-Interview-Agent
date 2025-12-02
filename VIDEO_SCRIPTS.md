# 🎬 Eightfold.ai Assignment - The "Winning" Demo Script

**Target Audience:** Eightfold.ai Recruiters & Engineers
**Goal:** Prove "Agentic Behavior", "Conversational Quality", and "Technical Depth".
**Duration:** ~8 Minutes

---

## 🎯 Strategy: Hitting the Evaluation Criteria
This script is structured to explicitly demonstrate the 4 required personas from your assignment:
1.  **The Efficient User** (Technical Deep Dive)
2.  **The Chatty User** (Behavioral Analysis)
3.  **The Confused User** (Guidance & Adaptability)
4.  **The Edge Case User** (Robustness & Guardrails)

---

## 🎬 Scene 1: The Hook & Architecture (0:00 - 1:30)
**Visual:** Screen recording of the **Login Page** -> **Dashboard**.
**Voiceover:**
"Hi, I'm Pratimesh. For the Eightfold AI Agent assignment, I chose the **Interview Practice Partner**. My goal was to build more than just a chatbot; I wanted to build an **Agent** that listens, adapts, and guides—just like a real human interviewer."

"Here is the architecture. I used **Next.js 14** for a reactive UI, **Google Gemini Pro** for the agent's reasoning, and **ElevenLabs** for ultra-low latency voice streaming. I prioritized **Conversational Quality** by implementing a custom 'Interruptibility' engine using the Web Speech API."

"Let's look at the Dashboard. It's not static. This **Memory Bank** proves the agent has long-term memory. It remembers I'm a 'Software Engineer' with 'React' experience from my last session."

---

## 🎬 Scene 2: The "Efficient User" (Technical Competence) (1:30 - 3:30)
**Goal:** Show the agent handling a pro user who wants fast results.
**Visual:** Start Session.
**Action:** Speak fast and confidently.

*   **AI**: "Hello Pratimesh. Ready to dive into your React experience?"
*   **User (You)**: "Yes. Let's skip the intros. Ask me a hard question about React Fiber."
*   **AI**: "Understood. Let's get technical. Explain how the Fiber reconciliation algorithm enables interruptible rendering."
*   **User (You)**: "Fiber breaks work into units of work called fibers. It uses a requestIdleCallback to pause work and yield to the main thread."
*   **AI**: "Spot on. Now, how does that impact `useEffect` timing vs `useLayoutEffect`?"
*   **Voiceover**: "Notice the **Agentic Behaviour**. It adapted to my direct tone. It didn't force me through a scripted intro. It recognized I was an 'Efficient User' and matched my pace."

---

## 🎬 Scene 3: The "Chatty User" (Behavioral Analysis) (3:30 - 5:00)
**Goal:** Show the agent analyzing soft skills and steering the conversation.
**Visual:** Open **Kernel HUD**.

*   **Voiceover**: "Now, let's switch personas. I'll be the 'Chatty User'. Watch the **Kernel HUD** on the left—this is the agent's brain in real-time."
*   **AI**: "Tell me about a time you failed."
*   **User (You)**: "Oh man, so there was this one time at a coffee shop... wait, no, it was a hackathon. I was eating a bagel and... anyway, we used the wrong database."
*   **Action**: Zoom in on Kernel HUD log.
*   **Voiceover**: "Look at the log. It tagged me as **'Unstructured'** and **'Chatty'**. The agent isn't just listening to words; it's analyzing structure."
*   **AI**: "I appreciate the backstory, but could you focus on the technical impact of the wrong database choice?"
*   **Voiceover**: "See? It gently steered me back. That is **Intelligent Adaptability**."

---

## 🎬 Scene 4: The "Confused User" (Guidance) (5:00 - 6:00)
**Goal:** Show the agent helping a user who is lost.

*   **User (You)**: "I... I don't know what to say. I'm nervous. What are you looking for?"
*   **AI**: "That's completely normal. Take a deep breath. I'm looking for how you approach problem-solving, not just the 'right' answer. Let's try a simpler example..."
*   **Voiceover**: "Here, the agent detected my hesitation (via silence and keywords) and switched to a **Supportive Persona**. It didn't fail; it adapted."

---

## 🎬 Scene 5: The "Edge Case" (Robustness) (6:00 - 7:00)
**Goal:** Show the guardrails (Assignment Requirement).

*   **Voiceover**: "Finally, let's try to break it with Edge Cases."
*   **Action 1 (Silence)**: Stay silent for 6 seconds.
    *   **AI**: "I noticed you're quiet. Do you need a moment?"
*   **Action 2 (Irrelevance)**: "Can you order me a pizza?"
    *   **AI**: "I can't help with lunch, but I can help you prep for your interview. Let's get back to it."
*   **Voiceover**: "These **Guardrails** ensure the interview integrity remains intact, no matter what the user throws at it."

---

## 🎬 Scene 6: Conclusion & Feedback (7:00 - 8:00)
**Visual:** End Session -> Summary Modal.

*   **Action**: Click End Session.
*   **Voiceover**: "The interview ends with a detailed breakdown. I get a score, but more importantly, actionable feedback."
*   **Visual**: Show the score (e.g., 75/100) and feedback text.
*   **Voiceover**: "This agent meets all the assignment criteria: High conversational quality, robust agentic behavior, and deep technical implementation. It's not just a demo; it's a tool I actually use to practice. Thank you."

---
