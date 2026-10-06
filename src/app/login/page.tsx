"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, ArrowRight, Briefcase, Code, LineChart } from "lucide-react";

// Dummy users for the hackathon demo
const DUMMY_USERS = [
    {
        id: "user_1",
        name: "Pratimesh Tiwari",
        role: "Software Engineer",
        avatar: "PT",
        color: "bg-blue-500",
        icon: Code,
    },
    {
        id: "user_2",
        name: "Sarah Jones",
        role: "Product Manager",
        avatar: "SJ",
        color: "bg-purple-500",
        icon: LineChart,
    },
    {
        id: "user_3",
        name: "Mike Ross",
        role: "Sales Representative",
        avatar: "MR",
        color: "bg-green-500",
        icon: Briefcase,
    },
];

export default function LoginPage() {
    const router = useRouter();
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = () => {
        if (!selectedUser) return;

        setIsLoading(true);

        // Simulate network delay
        setTimeout(() => {
            // Save user to localStorage
            const user = DUMMY_USERS.find(u => u.id === selectedUser);
            if (user) {
                localStorage.setItem("currentUser", JSON.stringify(user));
            }

            router.push("/dashboard");
        }, 800);
    };

    return (
        <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl z-10"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-slate-400 text-sm">Select a persona to continue your interview prep</p>
                </div>

                <div className="space-y-3 mb-8">
                    {DUMMY_USERS.map((user) => (
                        <button
                            key={user.id}
                            onClick={() => setSelectedUser(user.id)}
                            className={`w-full p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 group ${selectedUser === user.id
                                ? "bg-white/10 border-cyan-500/50 shadow-lg shadow-cyan-500/10"
                                : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-full ${user.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                                {user.avatar}
                            </div>
                            <div className="text-left flex-1">
                                <h3 className="text-white font-medium group-hover:text-cyan-400 transition-colors">{user.name}</h3>
                                <p className="text-xs text-slate-400">{user.role}</p>
                            </div>
                            {selectedUser === user.id && (
                                <motion.div layoutId="check" className="text-cyan-400">
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                                </motion.div>
                            )}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleLogin}
                    disabled={!selectedUser || isLoading}
                    className={`w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 ${!selectedUser
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.02]"
                        }`}
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            Continue to Dashboard
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>

                <p className="text-center mt-6 text-xs text-slate-500">
                    Developed by Pratimesh Tiwari
                </p>
            </motion.div>
        </main>
    );
}
