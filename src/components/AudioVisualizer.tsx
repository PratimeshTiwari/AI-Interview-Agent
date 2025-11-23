import { useEffect, useRef } from "react";

interface AudioVisualizerProps {
    stream: MediaStream | null;
    isSpeaking: boolean;
}

export default function AudioVisualizer({ stream, isSpeaking }: AudioVisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // If we have a stream (user mic) or just want to simulate "AI Speaking" mode
        // For this demo, we'll just do a simulated wave when AI is speaking
        // and a real one if we had the AI audio stream. 
        // Since we play audio via new Audio(), capturing that stream is tricky without AudioContext setup.
        // We'll do a simulated visualizer for the "AI Speaking" state for simplicity and "Wow" factor.

        const draw = () => {
            const width = canvas.width;
            const height = canvas.height;
            ctx.clearRect(0, 0, width, height);

            if (isSpeaking) {
                // Draw dynamic wave
                ctx.beginPath();
                ctx.moveTo(0, height / 2);

                const time = Date.now() / 100;
                for (let i = 0; i < width; i++) {
                    const amplitude = 20 + Math.sin(time * 0.5) * 10;
                    const frequency = 0.05;
                    const y = height / 2 + Math.sin(i * frequency + time) * amplitude;
                    ctx.lineTo(i, y);
                }

                ctx.strokeStyle = "#06b6d4"; // Cyan-500
                ctx.lineWidth = 3;
                ctx.shadowBlur = 15;
                ctx.shadowColor = "#06b6d4";
                ctx.stroke();
            } else {
                // Idle line
                ctx.beginPath();
                ctx.moveTo(0, height / 2);
                ctx.lineTo(width, height / 2);
                ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            animationRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isSpeaking]);

    return (
        <canvas
            ref={canvasRef}
            width={600}
            height={200}
            className="w-full h-full object-contain"
        />
    );
}
