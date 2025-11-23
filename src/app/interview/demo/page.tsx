"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Settings, Code, X, Brain, ChevronRight, ChevronLeft, Terminal } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

// --- Components ---

const AIOrb = ({ isSpeaking, isProcessing }: { isSpeaking: boolean, isProcessing: boolean }) => {
    return (
        <div className="relative flex items-center justify-center w-64 h-64">
            {/* Core */}
            <motion.div
                animate={{
                    scale: isSpeaking ? [1, 1.2, 1] : isProcessing ? [1, 1.1, 1] : 1,
                    opacity: isSpeaking ? 1 : 0.8,
                }}
                transition={{
                    duration: isSpeaking ? 0.5 : 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className={`w-32 h-32 rounded-full blur-xl ${isProcessing ? "bg-yellow-500" : "bg-cyan-500"}`}
            />

            {/* Outer Rings */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-48 h-48 rounded-full border border-white/10 border-t-cyan-500/50"
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute w-56 h-56 rounded-full border border-white/5 border-b-purple-500/30"
            />

            {/* Particles (Simplified) */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl ${isSpeaking ? "shadow-cyan-500/50" : ""}`}>
                    <Brain className={`w-10 h-10 ${isProcessing ? "text-yellow-400" : "text-cyan-400"}`} />
                </div>
            </div>
        </div>
    );
};

const UserVideo = () => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch(err => console.error("Camera error:", err));
    }, []);

    return (
        <motion.div
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} // Constrain for now or allow free movement
            className="w-48 h-36 bg-black rounded-xl overflow-hidden border border-white/20 shadow-2xl relative group cursor-move"
        >
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-[10px] text-white backdrop-blur-sm">
                You
            </div>
        </motion.div>
    );
};

const KernelHUD = ({ logs, isOpen, toggle }: { logs: any[], isOpen: boolean, toggle: () => void }) => {
    return (
        <motion.div
            initial={{ x: -300 }}
            animate={{ x: isOpen ? 0 : -320 }}
            className="fixed left-0 top-0 h-full w-80 bg-black/80 backdrop-blur-xl border-r border-white/10 z-40 flex flex-col font-mono text-xs"
        >
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-cyan-400 tracking-widest">KERNEL_LOG</span>
                </div>
                <button onClick={toggle} className="text-slate-400 hover:text-white">
                    <ChevronLeft className="w-4 h-4" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {logs.map((log, i) => (
                    <div key={i} className="border-l-2 border-white/10 pl-3 py-1 space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500">
                            <span>{log.timestamp}</span>
                            <span className="text-cyan-500">{log.phase}</span>
                        </div>
                        <p className="text-slate-300">{log.reasoning}</p>
                        <div className="flex gap-2 mt-1">
                            <span className={`text-[10px] px-1 rounded ${log.answer_quality === "Strong" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                                {log.answer_quality}
                            </span>
                            <span className="text-[10px] text-slate-500">Score: {log.current_score}</span>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

// --- Main Page ---

export default function DemoPage() {
    const router = useRouter();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [agentLogs, setAgentLogs] = useState<any[]>([]);
    const [showKernel, setShowKernel] = useState(true);
    const [showCode, setShowCode] = useState(false);

    // Mock Data for Demo
    useEffect(() => {
        // Add initial log
        setAgentLogs([{
            timestamp: new Date().toLocaleTimeString(),
            phase: "Initialization",
            user_persona: "Unknown",
            answer_quality: "N/A",
            reasoning: "System initialized. Waiting for candidate.",
            current_score: 100
        }]);
    }, []);

    const { startListening, stopListening, isListening: micActive, transcript: liveTranscript, error: micError } = useSpeechRecognition({});

    // Sync transcript and error
    useEffect(() => {
        if (liveTranscript) setTranscript(liveTranscript);
    }, [liveTranscript]);

    useEffect(() => {
        if (micError) console.error("Mic error:", micError);
    }, [micError]);

    // Sync mic state
    useEffect(() => { setIsListening(micActive); }, [micActive]);

    const handleMicClick = () => {
        if (isListening) {
            stopListening();
            // Simulate processing
            setIsProcessing(true);
            setTimeout(() => {
                setIsProcessing(false);
                setIsSpeaking(true);
                // Simulate agent response
                setTimeout(() => setIsSpeaking(false), 3000);

                // Add mock log
                setAgentLogs(prev => [...prev, {
                    timestamp: new Date().toLocaleTimeString(),
                    phase: "Discovery",
                    user_persona: "Normal",
                    answer_quality: "Strong",
                    reasoning: "User provided a clear introduction.",
                    current_score: 85
                }]);
            }, 1500);
        } else {
            startListening();
            setTranscript("");
        }
    };

    return (
        <main className="relative w-full h-screen bg-[#050505] overflow-hidden text-white font-sans selection:bg-cyan-500/30">

            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-[#050505] to-black pointer-events-none" />

            {/* Header */}
            <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-30">
                <div className="flex items-center gap-4">
                    {!showKernel && (
                        <button
                            onClick={() => setShowKernel(true)}
                            className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                        >
                            <Terminal className="w-5 h-5 text-cyan-400" />
                        </button>
                    )}
                    <h1 className="text-xl font-bold tracking-tight text-white/80">Insight Agent <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded ml-2">DEMO</span></h1>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowCode(!showCode)}
                        className={`p-2 rounded-lg transition-colors border ${showCode ? "bg-cyan-500 text-white border-cyan-500" : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"}`}
                    >
                        <Code className="w-5 h-5" />
                    </button>
                    <button onClick={() => router.push("/interview")} className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20">
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

                {/* Transcript / Status */}
                <div className="h-24 flex items-center justify-center text-center px-4 max-w-2xl">
                    <AnimatePresence mode="wait">
                        {isListening ? (
                            <motion.p
                                key="listening"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-2xl font-light text-cyan-100"
                            >
                                {transcript || "Listening..."}
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
                                Press microphone to speak
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>

                {/* Controls */}
                <div className="absolute bottom-12 flex items-center gap-6">
                    <button
                        onClick={handleMicClick}
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all transform hover:scale-105 shadow-2xl ${isListening ? "bg-red-500 shadow-red-500/50" : "bg-white text-black shadow-white/20"
                            }`}
                    >
                        {isListening ? <Square className="w-6 h-6 fill-current text-white" /> : <Mic className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-24 right-6 z-30">
                <UserVideo />
            </div>

            {/* Kernel HUD */}
            <KernelHUD logs={agentLogs} isOpen={showKernel} toggle={() => setShowKernel(!showKernel)} />

            {/* Code Editor Slide-over */}
            <AnimatePresence>
                {showCode && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        className="fixed right-0 top-0 h-full w-1/3 bg-[#1e1e1e] border-l border-white/10 z-40 shadow-2xl p-4"
                    >
                        <div className="flex justify-between items-center mb-4 text-slate-400">
                            <span className="font-mono text-sm">editor.tsx</span>
                            <button onClick={() => setShowCode(false)}><X className="w-4 h-4" /></button>
                        </div>
                        <div className="w-full h-full font-mono text-sm text-slate-300">
                            <textarea
                                className="w-full h-full bg-transparent resize-none focus:outline-none"
                                defaultValue="// Write your code here..."
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </main>
    );
}
