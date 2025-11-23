"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Play, Brain, History, Star, Briefcase,
    TrendingUp, Calendar, LogOut, ChevronRight, MessageSquare, Send, X, Sun, Moon
} from "lucide-react";

// Mock Jobs
const RECOMMENDED_JOBS = [
    { id: 1, title: "Senior Frontend Engineer", company: "TechCorp", match: "98%" },
    { id: 2, title: "Full Stack Developer", company: "StartupX", match: "92%" },
    { id: 3, title: "UI/UX Engineer", company: "DesignStudio", match: "88%" },
];

// Prep Checklist
const PREP_CHECKLIST = [
    { id: 1, task: "Review React Hooks (useMemo, useCallback)", done: true },
    { id: 2, task: "Practice System Design: URL Shortener", done: false },
    { id: 3, task: "Prepare 'Tell me about yourself' pitch", done: true },
    { id: 4, task: "Read up on Next.js 14 Server Actions", done: false },
];

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [memories, setMemories] = useState<any[]>([]);
    const [expandedSessionId, setExpandedSessionId] = useState<number | null>(null);
    const [theme, setTheme] = useState<"dark" | "light">("dark");

    // Chat Helper State
    const [showChat, setShowChat] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [chatMessages, setChatMessages] = useState<{ role: string, content: string }[]>([
        { role: "assistant", content: "Hi! I'm your Interview Helper. Ask me anything about prep, tips, or coding concepts!" }
    ]);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("currentUser");
        if (!storedUser) {
            router.push("/login");
            return;
        }
        setUser(JSON.parse(storedUser));

        // Load interview history
        const storedHistory = localStorage.getItem("interviewHistory");
        if (storedHistory) {
            setHistory(JSON.parse(storedHistory));
        }

        // Load memories
        const storedMemories = localStorage.getItem("userMemories");
        if (storedMemories) {
            setMemories(JSON.parse(storedMemories));
        }

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

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages, showChat]);

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        router.push("/login");
    };

    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMsg = chatInput;
        setChatInput("");
        setChatMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setIsChatLoading(true);

        try {
            const res = await fetch("/api/helper", {
                method: "POST",
                body: JSON.stringify({
                    message: userMsg,
                    context: {
                        user: { name: user.name, role: user.role, resume: user.resume },
                        history: history.slice(0, 3), // Send last 3 sessions
                        memories: memories
                    }
                }),
            });
            const data = await res.json();
            setChatMessages(prev => [...prev, { role: "assistant", content: data.response || "Sorry, I couldn't answer that." }]);
        } catch (err) {
            console.error("Chat helper error", err);
        } finally {
            setIsChatLoading(false);
        }
    };

    if (!user) return null;

    return (
        <main className={`min-h-screen p-4 md:p-8 relative overflow-hidden transition-colors duration-300 ${theme === "dark" ? "bg-slate-950" : "bg-slate-50"}`}>
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <header className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full ${user.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                            {user.avatar}
                        </div>
                        <div>
                            <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Hello, {user.name}</h1>
                            <p className={`${theme === "dark" ? "text-slate-400" : "text-slate-500"} text-sm`}>Ready to crush your next interview?</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full transition-colors ${theme === "dark" ? "hover:bg-white/10 text-slate-400 hover:text-white" : "hover:bg-slate-200 text-slate-500 hover:text-slate-900"}`}
                        >
                            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={handleLogout}
                            className={`p-2 rounded-full transition-colors ${theme === "dark" ? "hover:bg-white/10 text-slate-400 hover:text-white" : "hover:bg-slate-200 text-slate-500 hover:text-slate-900"}`}
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Left Column: Stats & Actions */}
                    <div className="space-y-6">
                        {/* Quick Action Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-cyan-500/20 relative overflow-hidden group cursor-pointer"
                            onClick={() => router.push("/interview")}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />

                            <h2 className="text-xl font-bold mb-2">Start New Interview</h2>
                            <p className="text-cyan-100 text-sm mb-6 opacity-90">Practice makes perfect. Start a new session now.</p>

                            <button
                                className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02] transition-all"
                            >
                                <Play className="w-4 h-4 fill-current" />
                                Start Session
                            </button>
                        </motion.div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                                <div className="flex items-center gap-2 text-slate-400 mb-2">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-xs uppercase font-medium">Avg Score</span>
                                </div>
                                <p className="text-2xl font-bold text-white">78%</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                                <div className="flex items-center gap-2 text-slate-400 mb-2">
                                    <History className="w-4 h-4" />
                                    <span className="text-xs uppercase font-medium">Sessions</span>
                                </div>
                                <p className="text-2xl font-bold text-white">{history.length + 12}</p>
                            </div>
                        </div>

                        {/* Skill Confidence Chart */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-cyan-400" />
                                Skill Confidence
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { skill: "React/Next.js", score: 85, color: "bg-cyan-500" },
                                    { skill: "System Design", score: 65, color: "bg-purple-500" },
                                    { skill: "Algorithms", score: 72, color: "bg-blue-500" },
                                    { skill: "Communication", score: 90, color: "bg-green-500" }
                                ].map((item, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-300">{item.skill}</span>
                                            <span className="text-white font-bold">{item.score}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${item.score}%` }}
                                                transition={{ duration: 1, delay: idx * 0.1 }}
                                                className={`h-full rounded-full ${item.color}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Middle Column: Memory Bank & Readiness */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm flex flex-col h-[300px]"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <Brain className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Memory Bank</h2>
                                    <p className="text-xs text-slate-400">What the AI remembers about you</p>
                                </div>
                            </div>

                            <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                {memories.length === 0 && (
                                    <p className="text-slate-500 text-xs text-center italic mt-10">
                                        No memories yet. Start an interview to let the AI learn about you!
                                    </p>
                                )}
                                {memories.map((memory, idx) => (
                                    <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors group">
                                        <p className="text-sm text-slate-300 group-hover:text-white transition-colors">
                                            "{memory.text}"
                                        </p>
                                        <span className="text-[10px] uppercase tracking-wider text-slate-500 mt-2 block">
                                            {memory.type}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Readiness Tracker */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm"
                        >
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-400" />
                                Interview Readiness
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { label: "Technical Knowledge", status: "Strong", color: "text-green-400" },
                                    { label: "Behavioral Answers", status: "Needs Practice", color: "text-yellow-400" },
                                    { label: "Coding Speed", status: "Good", color: "text-blue-400" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                        <span className="text-sm text-slate-300">{item.label}</span>
                                        <span className={`text-xs font-bold ${item.color}`}>{item.status}</span>
                                    </div>
                                ))}
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <p className="text-xs text-slate-400 text-center">
                                        Based on your last {history.length} sessions
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-500/20 rounded-lg">
                                <Calendar className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Recent Sessions</h2>
                                <p className="text-xs text-slate-400">Your practice history</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {history.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No recent interviews yet.</p>}
                            {history.map((interview, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setExpandedSessionId(expandedSessionId === idx ? null : idx)}
                                    className={`p-4 bg-white/5 rounded-xl transition-all cursor-pointer border ${expandedSessionId === idx ? "border-cyan-500/50 bg-white/10" : "border-white/5 hover:bg-white/10"}`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h4 className="text-white font-medium text-sm group-hover:text-cyan-400 transition-colors">{interview.role}</h4>
                                            <p className="text-xs text-slate-500">{new Date(interview.date).toLocaleDateString()} • {interview.duration}</p>
                                        </div>
                                        <div className="text-right flex items-center gap-3">
                                            <div>
                                                <span className={`block text-lg font-bold ${interview.score >= 80 ? "text-green-400" : interview.score >= 60 ? "text-yellow-400" : "text-red-400"}`}>
                                                    {interview.score || 0}%
                                                </span>
                                                <span className="text-[10px] text-slate-500">Score</span>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${expandedSessionId === idx ? "rotate-90" : ""}`} />
                                        </div>
                                    </div>

                                    {/* Summary Details - Expandable */}
                                    <AnimatePresence>
                                        {expandedSessionId === idx && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="mt-3 pt-3 border-t border-white/10">
                                                    <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                                                        <span className="text-cyan-400 font-bold block mb-1 text-xs uppercase">Summary</span>
                                                        {interview.summary || "No summary available."}
                                                    </p>

                                                    {interview.strengths && (
                                                        <div className="mb-3">
                                                            <span className="text-green-400 font-bold block mb-1 text-xs uppercase">Strengths</span>
                                                            <div className="flex flex-wrap gap-2">
                                                                {interview.strengths.map((s: string, i: number) => (
                                                                    <span key={i} className="px-2 py-1 bg-green-500/10 text-green-300 text-xs rounded-md border border-green-500/20">
                                                                        {s}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {interview.weaknesses && (
                                                        <div>
                                                            <span className="text-red-400 font-bold block mb-1 text-xs uppercase">Areas for Improvement</span>
                                                            <div className="flex flex-wrap gap-2">
                                                                {interview.weaknesses.map((w: string, i: number) => (
                                                                    <span key={i} className="px-2 py-1 bg-red-500/10 text-red-300 text-xs rounded-md border border-red-500/20">
                                                                        {w}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-6 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors border border-white/10 rounded-lg hover:bg-white/5">
                            View All History
                        </button>
                    </motion.div>

                </div>
            </div>

            {/* Gemini Chat Widget */}
            <div className="fixed bottom-6 right-6 z-50">
                <AnimatePresence>
                    {showChat && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            className="absolute bottom-16 right-0 w-80 md:w-96 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]"
                        >
                            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    <h3 className="text-white font-bold text-sm">AI Helper (Gemini)</h3>
                                </div>
                                <button onClick={() => setShowChat(false)} className="text-white/80 hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
                                {chatMessages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                        <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.role === "user"
                                            ? "bg-blue-600 text-white rounded-tr-none"
                                            : "bg-white/10 text-slate-200 rounded-tl-none"
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isChatLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white/10 p-3 rounded-xl rounded-tl-none flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <form onSubmit={handleChatSubmit} className="p-3 border-t border-white/10 bg-slate-900">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        placeholder="Ask for interview tips..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!chatInput.trim() || isChatLoading}
                                        className="absolute right-2 top-2 p-1.5 bg-blue-600 rounded-lg text-white disabled:opacity-50 hover:bg-blue-500 transition-colors"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => setShowChat(!showChat)}
                    className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
                >
                    {showChat ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                </button>
            </div>
        </main>
    );
}
