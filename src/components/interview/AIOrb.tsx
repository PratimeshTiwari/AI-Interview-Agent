"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";

export default function AIOrb({ isSpeaking, isProcessing }: { isSpeaking: boolean, isProcessing: boolean }) {
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
}
