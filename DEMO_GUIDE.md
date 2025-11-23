# Verification & Demo Walkthrough

## 1. Pre-Flight Check
- [ ] Ensure `.env.local` has valid API keys.
- [ ] Run `npm run dev`.
- [ ] Open `http://localhost:3000` in Chrome (best for Speech Recognition).

## 2. Demo Scenarios (for Video)

### Scenario A: The Standard Flow
1. **Setup**: Enter "Software Engineer" as the role. Paste a short bio: "I am a junior developer with React experience."
2. **Start**: Click "Start Interview".
3. **Interaction**:
   - **User**: "Hi, I'm ready."
   - **AI**: Should introduce itself.
   - **User**: "I built a React app last month."
   - **AI**: Should ask a technical question about React.
4. **Visuals**: Point out the audio visualizer moving when the AI speaks.

### Scenario B: The "Confused" User
1. **Interaction**:
   - **User**: "Wait, what are we doing? I want a pizza."
   - **AI**: Should politely steer back: "I can't help with pizza, but let's discuss your engineering skills."

### Scenario C: The "Edge Case"
1. **Interaction**:
   - **User**: (Mumble something unintelligible)
   - **AI**: Should ask for clarification.

## 3. Recording Tips
- Use a screen recorder (OBS or QuickTime).
- Enable "System Audio" recording so the viewer hears the AI.
- Speak clearly into your mic.
- Keep the video under 10 minutes.
