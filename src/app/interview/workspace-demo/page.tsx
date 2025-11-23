"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, X, Send, ChevronDown } from "lucide-react";

export default function WorkspaceDemo() {
    const [showCodeEditor, setShowCodeEditor] = useState(true);
    const [code, setCode] = useState("// Write your solution here...\n");
    const [selectedLanguage, setSelectedLanguage] = useState("javascript");

    const languages = [
        { value: "javascript", label: "JavaScript", placeholder: "// Write your JavaScript solution here...\n" },
        { value: "python", label: "Python", placeholder: "# Write your Python solution here...\n" },
        { value: "java", label: "Java", placeholder: "// Write your Java solution here...\n" },
        { value: "cpp", label: "C++", placeholder: "// Write your C++ solution here...\n" },
        { value: "go", label: "Go", placeholder: "// Write your Go solution here...\n" },
    ];

    const handleLanguageChange = (lang: string) => {
        setSelectedLanguage(lang);
        const placeholder = languages.find(l => l.value === lang)?.placeholder || "";
        setCode(placeholder);
    };

    const handleCodeSubmit = () => {
        if (!code.trim()) return;
        alert(`Code submitted in ${selectedLanguage}:\n\n${code}`);
    };

    return (
        <main className="relative w-full h-screen bg-[#050505] overflow-hidden text-white font-sans">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-[#050505] to-black" />

            <div className="relative z-10 flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-white">Coding Workspace Demo</h1>
                    <p className="text-slate-400">Improved coding workspace with language selector and submit button</p>
                    <button
                        onClick={() => setShowCodeEditor(!showCodeEditor)}
                        className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                    >
                        {showCodeEditor ? "Hide Workspace" : "Show Workspace"}
                    </button>
                </div>
            </div>

            {/* Code Editor Slide-over */}
            <AnimatePresence>
                {showCodeEditor && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        className="fixed right-0 top-0 h-full w-1/3 bg-[#1e1e1e] border-l border-white/10 z-40 shadow-2xl p-4 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4 text-slate-400">
                            <span className="font-mono text-sm flex items-center gap-2">
                                <Code className="w-4 h-4" /> Coding Workspace
                            </span>
                            <button
                                onClick={() => setShowCodeEditor(false)}
                                className="hover:text-white transition-colors"
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
                                    onChange={(e) => handleLanguageChange(e.target.value)}
                                    className="w-full bg-[#0d1117] text-slate-300 border border-white/10 rounded-lg px-3 py-2 text-sm appearance-none cursor-pointer focus:outline-none focus:border-cyan-500 pr-8"
                                >
                                    {languages.map(lang => (
                                        <option key={lang.value} value={lang.value}>
                                            {lang.label}
                                        </option>
                                    ))}
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
                                placeholder={languages.find(l => l.value === selectedLanguage)?.placeholder}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleCodeSubmit}
                            disabled={!code.trim() || code === languages.find(l => l.value === selectedLanguage)?.placeholder}
                            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                        >
                            <Send className="w-4 h-4" />
                            Submit for Review
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
