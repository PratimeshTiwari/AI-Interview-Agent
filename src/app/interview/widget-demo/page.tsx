"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, X, Send, ChevronDown, Minimize2, Maximize2 } from "lucide-react";

export default function WidgetDemo() {
    const [activeOption, setActiveOption] = useState<"bottom" | "floating" | "pip">("bottom");
    const [isOpen, setIsOpen] = useState(true);
    const [code, setCode] = useState("// Write your solution here...\n");
    const [selectedLanguage, setSelectedLanguage] = useState("javascript");

    return (
        <main className="relative w-full h-screen bg-[#050505] overflow-hidden text-white font-sans">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-[#050505] to-black" />

            {/* Demo Controls */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-800/90 backdrop-blur-md rounded-xl p-4 border border-white/10">
                <h2 className="text-sm font-bold mb-3 text-center">Choose Coding Widget Style</h2>
                <div className="flex gap-3">
                    <button
                        onClick={() => { setActiveOption("bottom"); setIsOpen(true); }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeOption === "bottom"
                                ? "bg-cyan-500 text-white"
                                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                            }`}
                    >
                        Option A: Bottom Drawer
                    </button>
                    <button
                        onClick={() => { setActiveOption("floating"); setIsOpen(true); }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeOption === "floating"
                                ? "bg-cyan-500 text-white"
                                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                            }`}
                    >
                        Option B: Floating Window
                    </button>
                    <button
                        onClick={() => { setActiveOption("pip"); setIsOpen(true); }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeOption === "pip"
                                ? "bg-cyan-500 text-white"
                                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                            }`}
                    >
                        Option C: Picture-in-Picture
                    </button>
                </div>
            </div>

            {/* Mock Interview Screen */}
            <div className="relative z-10 flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                    {/* AI Orb Placeholder */}
                    <div className="w-64 h-64 mx-auto mb-8 relative flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full blur-xl bg-cyan-500 animate-pulse" />
                    </div>
                    <p className="text-slate-400 text-lg">Press microphone to speak</p>
                </div>
            </div>

            {/* Option A: Bottom Drawer */}
            <AnimatePresence>
                {activeOption === "bottom" && isOpen && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        className="fixed bottom-0 left-0 w-full h-[40vh] bg-[#1e1e1e] border-t border-white/10 z-40 shadow-2xl p-4 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-3 text-slate-400">
                            <span className="font-mono text-sm flex items-center gap-2">
                                <Code className="w-4 h-4" /> Coding Workspace (Bottom Drawer)
                            </span>
                            <div className="flex gap-2">
                                <button onClick={() => setIsOpen(false)} className="hover:text-white">
                                    <Minimize2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-3 flex-1">
                            <div className="flex-1 flex flex-col gap-2">
                                <select
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                    className="bg-[#0d1117] text-slate-300 border border-white/10 rounded px-2 py-1 text-xs"
                                >
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                </select>
                                <textarea
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="flex-1 bg-[#0d1117] text-slate-300 p-3 font-mono text-sm resize-none border border-white/10 rounded"
                                    spellCheck="false"
                                />
                            </div>
                            <button className="px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg flex items-center gap-2">
                                <Send className="w-4 h-4" />
                                Submit
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Option B: Floating Window */}
            <AnimatePresence>
                {activeOption === "floating" && isOpen && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="fixed bottom-20 right-20 w-[500px] h-[400px] bg-[#1e1e1e] border border-white/10 z-40 shadow-2xl rounded-xl p-4 flex flex-col"
                        drag
                        dragMomentum={false}
                    >
                        <div className="flex justify-between items-center mb-3 text-slate-400 cursor-move">
                            <span className="font-mono text-sm flex items-center gap-2">
                                <Code className="w-4 h-4" /> Coding Workspace (Draggable)
                            </span>
                            <button onClick={() => setIsOpen(false)} className="hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                            <select
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                className="bg-[#0d1117] text-slate-300 border border-white/10 rounded px-2 py-1 text-xs"
                            >
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                            </select>
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="flex-1 bg-[#0d1117] text-slate-300 p-3 font-mono text-sm resize-none border border-white/10 rounded"
                                spellCheck="false"
                            />
                            <button className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg flex items-center justify-center gap-2">
                                <Send className="w-4 h-4" />
                                Submit for Review
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Option C: Picture-in-Picture */}
            <AnimatePresence>
                {activeOption === "pip" && (
                    <>
                        {isOpen ? (
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                className="fixed bottom-6 right-6 w-[400px] bg-[#1e1e1e] border border-white/10 z-40 shadow-2xl rounded-xl p-3 flex flex-col gap-2"
                            >
                                <div className="flex justify-between items-center text-slate-400">
                                    <span className="font-mono text-xs flex items-center gap-2">
                                        <Code className="w-3 h-3" /> Code Editor
                                    </span>
                                    <div className="flex gap-1">
                                        <button onClick={() => setIsOpen(false)} className="hover:text-white">
                                            <Minimize2 className="w-3 h-3" />
                                        </button>
                                        <button onClick={() => setIsOpen(false)} className="hover:text-white">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                                <select
                                    value={selectedLanguage}
                                    className="bg-[#0d1117] text-slate-300 border border-white/10 rounded px-2 py-1 text-xs"
                                >
                                    <option value="javascript">JavaScript</option>
                                </select>
                                <textarea
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="h-32 bg-[#0d1117] text-slate-300 p-2 font-mono text-xs resize-none border border-white/10 rounded"
                                    spellCheck="false"
                                />
                                <button className="w-full py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded text-xs flex items-center justify-center gap-1">
                                    <Send className="w-3 h-3" />
                                    Submit
                                </button>
                            </motion.div>
                        ) : (
                            <motion.button
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                onClick={() => setIsOpen(true)}
                                className="fixed bottom-6 right-6 w-14 h-14 bg-cyan-500 rounded-full shadow-2xl flex items-center justify-center hover:bg-cyan-600 transition-colors z-40"
                            >
                                <Code className="w-6 h-6 text-white" />
                            </motion.button>
                        )}
                    </>
                )}
            </AnimatePresence>
        </main>
    );
}
