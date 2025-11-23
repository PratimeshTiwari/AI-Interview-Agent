"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Settings, Code, X, Terminal, Send, Briefcase, Keyboard, ChevronDown, GripVertical, Sun, Moon } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import AudioVisualizer from "@/components/AudioVisualizer";
import AIOrb from "@/components/interview/AIOrb";
import UserVideo from "@/components/interview/UserVideo";
import KernelHUD from "@/components/interview/KernelHUD";

type Message = {
    role: "user" | "assistant" | "system";
    content: string;
};

export default function InterviewPage() {
    // Define handleMicClick first so it can be used in onSilence
    const handleMicClickRef = useRef<() => void>(() => { });

    const { isListening, transcript, interimTranscript, startListening, stopListening, getLatestTranscript, error: speechError } = useSpeechRecognition({
        onSilence: () => {
            console.log("🤫 Silence detected in hook, auto-submitting...");
            handleMicClickRef.current();
        }
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [resume, setResume] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [jobRole, setJobRole] = useState("Software Engineer");
    const [showSettings, setShowSettings] = useState(true);
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const [aiSubtitle, setAiSubtitle] = useState(""); // For real-time AI text display
    const [showKeyboard, setShowKeyboard] = useState(false); // Toggle for keyboard input
    const [textInput, setTextInput] = useState("");
    const [feedback, setFeedback] = useState(""); // Feedback state
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [micStream, setMicStream] = useState<MediaStream | null>(null);
    const [isAuthChecking, setIsAuthChecking] = useState(true);
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

    // New State for UI Overhaul
    const [agentLogs, setAgentLogs] = useState<any[]>([]);
    const [showCodeEditor, setShowCodeEditor] = useState(false);
    const [code, setCode] = useState("// Write your solution here...\n");
    const [selectedLanguage, setSelectedLanguage] = useState("javascript");
    const [codeEditorWidth, setCodeEditorWidth] = useState(350); // Start at 350px (slim)
    const [isResizingCodeEditor, setIsResizingCodeEditor] = useState(false);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [summaryResult, setSummaryResult] = useState<any>(null);
    const [showKernel, setShowKernel] = useState(true); // Default to showing kernel in immersive mode

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const transcriptRef = useRef("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Keep ref updated for the silence callback


    // Update ref whenever transcript or interim changes
    useEffect(() => {
        transcriptRef.current = transcript + (interimTranscript ? " " + interimTranscript : "");
    }, [transcript, interimTranscript]);

    // Load user from local storage and handle redirect
    useEffect(() => {
        const storedUser = localStorage.getItem("currentUser");
        if (!storedUser) {
            router.push("/login");
            return;
        }
        setCurrentUser(JSON.parse(storedUser));
        setIsAuthChecking(false);

        // Load theme
        const storedTheme = localStorage.getItem("theme") as "dark" | "light";
        if (storedTheme) {
            setTheme(storedTheme);
            if (storedTheme === "light") {
                document.documentElement.classList.add("light");
            } else {
                document.documentElement.classList.remove("light");
            }
        }
    }, [router]);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        if (newTheme === "light") {
            document.documentElement.classList.add("light");
        } else {
            document.documentElement.classList.remove("light");
        }
    };

    // Get Mic Stream for Visualization
    useEffect(() => {
        if (isListening && !micStream) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => setMicStream(stream))
                .catch(err => console.error("Failed to get mic stream for visualizer", err));
        } else if (!isListening && micStream) {
            setMicStream(null);
        }
    }, [isListening]);

    // Handle code editor resize
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizingCodeEditor) return;
            const newWidth = window.innerWidth - e.clientX;
            setCodeEditorWidth(Math.max(300, Math.min(800, newWidth)));
        };

        const handleMouseUp = () => {
            setIsResizingCodeEditor(false);
        };

        if (isResizingCodeEditor) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "ew-resize";
            document.body.style.userSelect = "none";
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };
    }, [isResizingCodeEditor]);

    // Timeout Logic: End session after 2 minutes of inactivity
    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const resetTimer = () => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                console.log("Session timed out due to inactivity.");
                handleEndSession();
            }, 2 * 60 * 1000); // 2 minutes
        };

        resetTimer();

        if (isListening || isSpeaking || isProcessing || textInput) {
            resetTimer();
        }

        return () => clearTimeout(timeout);
    }, [isListening, isSpeaking, isProcessing, textInput]);

    const handleEndSession = async () => {
        setIsGeneratingSummary(true);
        try {
            const res = await fetch("/api/summary", {
                method: "POST",
                body: JSON.stringify({ messages, role: jobRole }),
            });
            const summaryData = await res.json();

            const history = JSON.parse(localStorage.getItem("interviewHistory") || "[]");
            const newSession = {
                date: new Date().toISOString(),
                role: jobRole,
                duration: "10m", // Mock duration
                score: summaryData.score,
                summary: summaryData.summary,
                strengths: summaryData.strengths,
                weaknesses: summaryData.weaknesses
            };
            history.unshift(newSession);
            localStorage.setItem("interviewHistory", JSON.stringify(history));

            setSummaryResult(newSession);
            setShowSummaryModal(true);

        } catch (error) {
            console.error("Failed to generate summary", error);
            const history = JSON.parse(localStorage.getItem("interviewHistory") || "[]");
            const newSession = {
                date: new Date().toISOString(),
                role: jobRole,
                duration: "10m",
                score: 0,
                summary: "Summary unavailable",
            };
            history.unshift(newSession);
            localStorage.setItem("interviewHistory", JSON.stringify(history));

            setSummaryResult(newSession);
            setShowSummaryModal(true);
        } finally {
            setIsGeneratingSummary(false);
        }
    };



    const handleMicClick = async () => {
        if (isListening) {
            stopListening();
            setTimeout(() => {
                const text = transcriptRef.current;
                if (!text || text.trim() === "") return;
                handleUserTurn(text);
            }, 1000);
        } else {
            try {
                startListening();
            } catch (error) {
                console.error("Error starting mic:", error);
            }
        }
    };

    // Keep ref updated for the silence callback
    useEffect(() => {
        handleMicClickRef.current = handleMicClick;
    }, [isListening, transcript, interimTranscript]);



    const handleTextSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!textInput.trim()) return;
        handleUserTurn(textInput);
        setTextInput("");
    };

    // Submit code answer from the coding workspace
    const handleCodeSubmit = () => {
        if (!code.trim()) return;
        // Treat the code as a user answer
        handleUserTurn(code);
        setCode("// Write your solution here...\n");
        setShowCodeEditor(false);
    };

    // Handle user turn (text or code)
    const handleUserTurn = async (userText: string) => {
        if (!userText.trim()) return;

        setIsProcessing(true);
        const newMessages = [...messages, { role: "user" as const, content: userText }];
        setMessages(newMessages);

        try {
            const chatRes = await fetch("/api/chat", {
                method: "POST",
                body: JSON.stringify({
                    messages: newMessages,
                    resume,
                    jobDescription,
                    role: jobRole,
                    userId: currentUser?.id || "guest",
                }),
            });

            const data = await chatRes.json();

            if (data.analysis) {
                setAgentLogs((prev) => [...prev, { ...data.analysis, timestamp: new Date().toLocaleTimeString() }]);

                // Auto-open coding workspace for technical questions
                console.log("🔍 Phase detected:", data.analysis?.phase);
                if (data.analysis?.phase === "Technical Deep Dive" && jobRole.toLowerCase().includes("engineer")) {
                    console.log("✅ Opening coding workspace based on phase");
                    setShowCodeEditor(true);
                }
            }

            const aiText = data.response;
            setAiSubtitle(aiText);

            // Check for explicit coding requests (more specific keywords)
            const codingKeywords = [
                "write a function",
                "write code",
                "implement a",
                "implement the",
                "solve this problem",
                "code this",
                "algorithm for",
                "write a solution",
                "coding challenge",
                "coding problem"
            ];
            const hasCodingKeyword = codingKeywords.some(keyword => aiText.toLowerCase().includes(keyword));

            if (hasCodingKeyword && jobRole.toLowerCase().includes("engineer")) {
                console.log("✅ Opening coding workspace based on explicit coding request");
                setShowCodeEditor(true);
            }

            if (data.feedback) {
                setFeedback(data.feedback);
                setTimeout(() => setFeedback(""), 8000);
            }

            setMessages((prev) => [...prev, { role: "assistant", content: aiText }]);

            // Play AI response via TTS
            try {
                const speakRes = await fetch("/api/speak", {
                    method: "POST",
                    body: JSON.stringify({ text: aiText }),
                });
                if (!speakRes.ok) throw new Error("TTS API failed");
                const audioBlob = await speakRes.blob();
                const audioUrl = URL.createObjectURL(audioBlob);
                if (audioRef.current) {
                    audioRef.current.src = audioUrl;
                    await audioRef.current.play();
                    setIsSpeaking(true);
                    audioRef.current.onended = () => {
                        setIsSpeaking(false);
                        setAiSubtitle("");
                    };
                }
            } catch (ttsError) {
                console.error("TTS API Error, falling back to Browser TTS:", ttsError);
                const utterance = new SpeechSynthesisUtterance(aiText);
                utterance.onstart = () => setIsSpeaking(true);
                utterance.onend = () => {
                    setIsSpeaking(false);
                    setAiSubtitle("");
                };
                utterance.onerror = () => {
                    setIsSpeaking(false);
                    setAiSubtitle("");
                };
                window.speechSynthesis.speak(utterance);
            }
        } catch (err) {
            console.error("Error in turn:", err);
        } finally {
            setIsProcessing(false);
        }
    };


    const testAudio = () => {
        const utterance = new SpeechSynthesisUtterance("Audio system check.");
        window.speechSynthesis.speak(utterance);
    };

    const testMic = () => {
        if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
            alert("Speech recognition is not supported.");
            return;
        }
        alert("Please speak now.");
        startListening();
        setTimeout(() => {
            stopListening();
            alert("Mic test complete.");
        }, 5000);
    };



    if (isAuthChecking) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <main className={`flex flex-col h-screen overflow-hidden relative transition-colors duration-300 ${theme === "dark" ? "bg-[#050505] text-white" : "bg-slate-50 text-slate-900"}`}>
            <audio ref={audioRef} className="hidden" />

            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-b pointer-events-none ${theme === "dark" ? "from-slate-900 via-[#050505] to-black" : "from-white via-slate-50 to-slate-100"}`} />

            {/* Header */}
            <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className={`font-mono text-xs tracking-widest uppercase ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                        Live Session • {jobRole}
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowCodeEditor(!showCodeEditor)}
                        className={`p-2 rounded-lg transition-colors border ${showCodeEditor ? "bg-cyan-500 text-white border-cyan-500" : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"}`}
                    >
                        <Code className="w-5 h-5" />
                    </button>
                    <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-lg bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10">
                        <Settings className="w-5 h-5" />
                    </button>
                    <button onClick={handleEndSession} className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">

                {/* AI Orb */}
                <div className="mb-12">
                    <AIOrb isSpeaking={isSpeaking} isProcessing={isProcessing} />
                </div>

                {/* Transcript / Status / Subtitles */}
                <div className="h-32 flex flex-col items-center justify-center text-center px-4 max-w-3xl z-20">
                    <AnimatePresence mode="wait">
                        {isSpeaking && aiSubtitle ? (
                            <motion.div
                                key="subtitle"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl"
                            >
                                <p className="text-lg text-cyan-100 font-medium leading-relaxed">
                                    "{aiSubtitle}"
                                </p>
                            </motion.div>
                        ) : isListening ? (
                            <motion.p
                                key="listening"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-2xl font-light text-cyan-100"
                            >
                                {transcript || interimTranscript || "Listening..."}
                            </motion.p>
                        ) : isProcessing ? (
                            <motion.p
                                key="processing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-lg text-yellow-400 flex items-center gap-2"
                            >
                                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" />
                                Thinking...
                            </motion.p>
                        ) : (
                            <motion.p
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-slate-500"
                            >
                                {showKeyboard ? "Type your answer below" : "Press microphone to speak"}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>

                {/* Controls */}
                <div className="absolute bottom-12 flex items-center gap-6 z-30">
                    <button
                        onClick={() => setShowKeyboard(!showKeyboard)}
                        className={`p-3 rounded-full transition-colors ${showKeyboard ? "bg-cyan-500 text-white" : "bg-white/10 text-slate-400 hover:bg-white/20"}`}
                    >
                        <Keyboard className="w-5 h-5" />
                    </button>

                    {showKeyboard ? (
                        <form onSubmit={handleTextSubmit} className="flex gap-2 bg-black/50 p-2 rounded-2xl border border-white/10 backdrop-blur-md w-96">
                            <input
                                type="text"
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder="Type your answer..."
                                className="flex-1 bg-transparent border-none text-white px-4 focus:outline-none"
                                autoFocus
                            />
                            <button type="submit" disabled={!textInput.trim()} className="p-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white transition-colors disabled:opacity-50">
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    ) : (
                        <button
                            onClick={handleMicClick}
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all transform hover:scale-105 shadow-2xl ${isListening ? "bg-red-500 shadow-red-500/50" : "bg-white text-black shadow-white/20"
                                }`}
                        >
                            {isListening ? <Square className="w-6 h-6 fill-current text-white" /> : <Mic className="w-6 h-6" />}
                        </button>
                    )}
                </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-24 right-6 z-30">
                <UserVideo />
            </div>

            {/* Kernel HUD */}
            <KernelHUD logs={agentLogs} isOpen={showKernel} toggle={() => setShowKernel(!showKernel)} />

            {/* Resizable Code Editor Slide-over */}
            <AnimatePresence>
                {showCodeEditor && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        style={{ width: `${codeEditorWidth}px` }}
                        className="fixed right-0 top-0 h-full bg-[#1e1e1e] border-l border-white/10 z-40 shadow-2xl flex"
                    >
                        {/* Resize Handle */}
                        <div
                            onMouseDown={() => setIsResizingCodeEditor(true)}
                            className="w-1 bg-white/5 hover:bg-cyan-500/50 cursor-ew-resize flex items-center justify-center group relative transition-colors"
                        >
                            <div className="absolute left-0 w-4 h-full flex items-center justify-center">
                                <GripVertical className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col p-4 overflow-hidden">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-4 text-slate-400">
                                <span className="font-mono text-sm flex items-center gap-2">
                                    <Code className="w-4 h-4" /> Coding Workspace
                                </span>
                                <button
                                    onClick={() => setShowCodeEditor(false)}
                                    className="hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Language Selector */}
                            <div className="mb-3">
                                <label className="text-xs text-slate-400 uppercase font-medium mb-2 block">Language</label>
                                <div className="relative">
                                    <select
                                        value={selectedLanguage}
                                        onChange={(e) => {
                                            setSelectedLanguage(e.target.value);
                                            const placeholders: Record<string, string> = {
                                                javascript: "// Write your JavaScript solution here...\n",
                                                python: "# Write your Python solution here...\n",
                                                java: "// Write your Java solution here...\n",
                                                cpp: "// Write your C++ solution here...\n",
                                                go: "// Write your Go solution here...\n"
                                            };
                                            setCode(placeholders[e.target.value] || "// Write your solution here...\n");
                                        }}
                                        className="w-full bg-[#0d1117] text-slate-300 border border-white/10 rounded-lg px-3 py-2 text-sm appearance-none cursor-pointer focus:outline-none focus:border-cyan-500 pr-8"
                                    >
                                        <option value="javascript">JavaScript</option>
                                        <option value="python">Python</option>
                                        <option value="java">Java</option>
                                        <option value="cpp">C++</option>
                                        <option value="go">Go</option>
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Code Editor */}
                            <div className="flex-1 relative mb-3">
                                <textarea
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full h-full bg-[#0d1117] text-slate-300 p-4 font-mono text-sm focus:outline-none resize-none border border-white/10 rounded-lg focus:border-cyan-500"
                                    spellCheck="false"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleCodeSubmit}
                                disabled={!code.trim() || code.startsWith("//") && code.split("\n").length === 2}
                                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                            >
                                <Send className="w-4 h-4" />
                                Submit for Review
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Settings Slide-over */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        className="fixed right-0 top-0 h-full w-1/4 bg-black/90 backdrop-blur-xl border-l border-white/10 z-50 p-6 overflow-y-auto space-y-6"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold text-white">Context</h2>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase">Target Role</label>
                            <input
                                type="text"
                                value={jobRole}
                                onChange={(e) => setJobRole(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase">Resume Summary</label>
                            <textarea
                                value={resume}
                                onChange={(e) => setResume(e.target.value)}
                                className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 resize-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase">Job Description</label>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 resize-none"
                            />
                        </div>
                        <div className="pt-4 space-y-2">
                            <button
                                onClick={() => {
                                    setShowSettings(false);
                                    handleUserTurn("Hi, I am ready to start the interview.");
                                }}
                                className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-cyan-500/20"
                            >
                                Start Interview
                            </button>
                            <button
                                onClick={testAudio}
                                className="w-full py-2 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg text-xs font-medium transition-colors border border-white/10"
                            >
                                Test Audio
                            </button>
                            <button
                                onClick={testMic}
                                className="w-full py-2 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg text-xs font-medium transition-colors border border-white/10"
                            >
                                Test Mic
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Summary Modal */}
            <AnimatePresence>
                {showSummaryModal && summaryResult && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-slate-900 border border-white/10 rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 to-blue-600" />

                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-white mb-2">Interview Complete</h2>
                                <p className="text-slate-400">Here is how you performed</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                                    <p className="text-slate-400 text-xs uppercase font-bold mb-1">Score</p>
                                    <p className={`text-4xl font-bold ${summaryResult.score >= 80 ? "text-green-400" : summaryResult.score >= 60 ? "text-yellow-400" : "text-red-400"}`}>
                                        {summaryResult.score}%
                                    </p>
                                </div>
                                <div className="col-span-2 bg-white/5 rounded-xl p-4 border border-white/5 text-left">
                                    <p className="text-slate-400 text-xs uppercase font-bold mb-2">Summary</p>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        {summaryResult.summary}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <h3 className="text-green-400 font-bold text-sm mb-3 uppercase flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-400 rounded-full" /> Strengths
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {summaryResult.strengths?.map((s: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-green-500/10 text-green-300 text-xs rounded-full border border-green-500/20">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-red-400 font-bold text-sm mb-3 uppercase flex items-center gap-2">
                                        <span className="w-2 h-2 bg-red-400 rounded-full" /> Improvements
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {summaryResult.weaknesses?.map((w: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-red-500/10 text-red-300 text-xs rounded-full border border-red-500/20">
                                                {w}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => window.location.href = "/dashboard"}
                                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/20 transition-all transform hover:scale-[1.01]"
                            >
                                Return to Dashboard
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </main>
    );
}
