"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, X, Send, ChevronDown, GripVertical } from "lucide-react";

export default function ResizableWidgetDemo() {
    const [isOpen, setIsOpen] = useState(true);
    const [width, setWidth] = useState(350); // Start narrow (350px)
    const [code, setCode] = useState("// Write your solution here...\n");
    const [selectedLanguage, setSelectedLanguage] = useState("javascript");
    const [isResizing, setIsResizing] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    // Handle resize
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;
            const newWidth = window.innerWidth - e.clientX;
            // Constrain between 300px (slim) and 800px (wide)
            setWidth(Math.max(300, Math.min(800, newWidth)));
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
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
    }, [isResizing]);

    return (
        <main className="relative w-full h-screen bg-[#050505] overflow-hidden text-white font-sans">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-[#050505] to-black" />

            {/* Instructions */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 bg-cyan-500/10 backdrop-blur-md rounded-xl p-4 border border-cyan-500/30">
                <h2 className="text-sm font-bold mb-2 text-cyan-400">Resizable Coding Workspace Demo</h2>
                <p className="text-xs text-slate-300 max-w-md">
                    • Starts at 350px (slim)<br />
                    • Drag the <GripVertical className="w-3 h-3 inline" /> handle to resize<br />
                    • Max width: 800px (similar to Kernel HUD)<br />
                    • Slides in from right
                </p>
            </div>

            {/* Mock Interview Screen */}
            <div className="relative z-10 flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                    {/* AI Orb */}
                    <div className="w-64 h-64 mx-auto mb-8 relative flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full blur-xl bg-cyan-500 animate-pulse" />
                    </div>
                    <p className="text-slate-400 text-lg">Press microphone to speak</p>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-sm"
                    >
                        {isOpen ? "Hide" : "Show"} Coding Workspace
                    </button>
                </div>
            </div>

            {/* Resizable Coding Workspace */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={panelRef}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        style={{ width: `${width}px` }}
                        className="fixed right-0 top-0 h-full bg-[#1e1e1e] border-l border-white/10 z-40 shadow-2xl flex"
                    >
                        {/* Resize Handle */}
                        <div
                            onMouseDown={() => setIsResizing(true)}
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
                                    onClick={() => setIsOpen(false)}
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
                                        onChange={(e) => setSelectedLanguage(e.target.value)}
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

                            {/* Width Indicator */}
                            <div className="mb-3 text-center">
                                <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
                                    Width: {width}px {width === 350 ? "(slim)" : width > 600 ? "(wide)" : "(medium)"}
                                </span>
                            </div>

                            {/* Code Editor */}
                            <div className="flex-1 relative mb-3">
                                <textarea
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full h-full bg-[#0d1117] text-slate-300 p-4 font-mono text-sm focus:outline-none resize-none border border-white/10 rounded-lg focus:border-cyan-500"
                                    spellCheck="false"
                                    placeholder="// Start coding..."
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={() => alert(`Code submitted!\n\nLanguage: ${selectedLanguage}\nWidth: ${width}px`)}
                                disabled={!code.trim() || code === "// Write your solution here...\n"}
                                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                            >
                                <Send className="w-4 h-4" />
                                Submit for Review
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
