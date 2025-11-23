"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function UserVideo() {
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
}
