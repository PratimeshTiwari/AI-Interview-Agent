"use client";

import { motion } from "framer-motion";
import { Terminal, ChevronLeft } from "lucide-react";

export default function KernelHUD({ logs, isOpen, toggle }: { logs: any[], isOpen: boolean, toggle: () => void }) {
    return (
        <motion.div
            initial={{ x: -300 }}
            animate={{ x: isOpen ? 0 : -320 }}
            className="fixed left-0 top-0 h-full w-80 bg-black/90 backdrop-blur-xl border-r border-white/10 z-40 flex flex-col font-mono text-xs shadow-2xl"
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
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {logs.map((log, i) => (
                    <div key={i} className="border-l-2 border-white/10 pl-3 py-2 space-y-2 relative group">
                        <div className="absolute -left-[17px] top-2 w-2 h-2 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors" />

                        <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-wider">
                            <span>{log.timestamp}</span>
                            <span className="text-cyan-500 font-bold">{log.phase}</span>
                        </div>

                        {/* Behavior Analysis */}
                        {log.behavior_log && (
                            <div className="bg-white/5 p-2 rounded border border-white/5">
                                <span className="text-[10px] text-slate-400 uppercase block mb-1">Behavior Analysis</span>
                                <p className="text-slate-300 italic leading-relaxed">"{log.behavior_log}"</p>
                            </div>
                        )}

                        {/* Reasoning */}
                        <div className="text-slate-400">
                            <span className="text-purple-400 font-bold">REASONING:</span> {log.reasoning}
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className={`p-2 rounded border ${log.answer_quality === "Strong" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"}`}>
                                <div className="text-[9px] uppercase opacity-70">Quality</div>
                                <div className="font-bold">{log.answer_quality}</div>
                            </div>

                            <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                <div className="text-[9px] uppercase opacity-70">Score</div>
                                <div className="font-bold">{log.current_score}</div>
                            </div>

                            {/* Plagiarism Score */}
                            {log.plagiarism_score !== undefined && (
                                <div className={`col-span-2 p-2 rounded border flex justify-between items-center ${log.plagiarism_score > 70 ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-slate-800 border-white/10 text-slate-400"
                                    }`}>
                                    <div>
                                        <div className="text-[9px] uppercase opacity-70">Plagiarism Risk</div>
                                        <div className="font-bold">{log.plagiarism_score}%</div>
                                    </div>
                                    {log.session_plagiarism_score !== undefined && (
                                        <div className="text-right">
                                            <div className="text-[9px] uppercase opacity-70">Session Risk</div>
                                            <div className="font-bold">{log.session_plagiarism_score}%</div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
