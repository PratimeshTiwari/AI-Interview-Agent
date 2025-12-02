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

    const [userId, setUserId] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId.trim()) return;

        // Save user to local storage
        const user = {
            id: userId,
            name: userId, // Use ID as name for now
            email: `${userId}@example.com`,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`
        };
        localStorage.setItem("currentUser", JSON.stringify(user));
        router.push("/dashboard");
    };

    return (
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
            </motion.div >
        </main >
    );
}
