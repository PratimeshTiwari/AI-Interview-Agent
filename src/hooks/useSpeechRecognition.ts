import { useState, useEffect, useCallback, useRef } from "react";

export function useSpeechRecognition({ onSilence }: { onSilence?: () => void } = {}) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [interimTranscript, setInterimTranscript] = useState("");
    const [error, setError] = useState<string | null>(null);

    const recognitionRef = useRef<any>(null);
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
            setError("Speech recognition is not supported in this browser.");
            return;
        }
    }, []);

    const startListening = useCallback(() => {
        setError(null);
        setIsListening(true);
        setTranscript("");
        setInterimTranscript("");

        // @ts-ignore
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
            console.log("🎤 Speech recognition STARTED");
        };

        recognition.onresult = (event: any) => {
            console.log("🔊 onresult fired");

            // Reset silence timer on every result
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            if (onSilence) {
                silenceTimerRef.current = setTimeout(() => {
                    console.log("🤫 Silence detected, triggering callback...");
                    onSilence();
                }, 2000); // 2 seconds of silence
            }

            let final = "";
            let interim = "";

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final += event.results[i][0].transcript;
                } else {
                    interim += event.results[i][0].transcript;
                }
            }

            if (final) {
                setTranscript((prev) => {
                    const newTranscript = prev ? prev + " " + final : final;
                    return newTranscript;
                });
            }
            setInterimTranscript(interim);
        };

        recognition.onerror = (event: any) => {
            console.log("❌ Speech error:", event.error);
            if (event.error === "no-speech" || event.error === "aborted") {
                setIsListening(false);
                return;
            }
            setError(event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            console.log("🛑 Speech recognition ENDED");
            setIsListening(false);
            setInterimTranscript("");
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        };

        recognition.start();
    }, [onSilence]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        setIsListening(false);
    }, []);

    const getLatestTranscript = useCallback(() => {
        return transcript + (interimTranscript ? " " + interimTranscript : "");
    }, [transcript, interimTranscript]);

    return {
        isListening,
        transcript,
        interimTranscript,
        startListening,
        stopListening,
        getLatestTranscript,
        error,
    };
}
