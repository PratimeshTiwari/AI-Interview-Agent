"use client";

import { motion } from "framer-motion";
import { Terminal, ChevronLeft } from "lucide-react";

export default function KernelHUD({ logs, isOpen, toggle }: { logs: any[], isOpen: boolean, toggle: () => void }) {
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
}
