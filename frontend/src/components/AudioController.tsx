"use client";

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback } from "react";
import { ArcadeButton } from "./shared/ArcadeButton";

// --- CONTEXT DEFINITION ---
interface AudioContextType {
    isMuted: boolean;
    toggleMute: () => void;
    // SFX triggers
    playSfx: (type: "hover" | "click" | "up" | "down" | "start") => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
    const audioCtxRef = useRef<AudioContext | null>(null);

    // Context exports
    const [isMuted, setIsMuted] = useState(true); // Default muted to comply with autoplay policies

    // Master Gain Nodes for mixing
    const masterGainRef = useRef<GainNode | null>(null);

    // --- AUDIO INITIALIZATION ---
    const initAudio = () => {
        if (audioCtxRef.current) return audioCtxRef.current;

        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        masterGainRef.current = ctx.createGain();
        masterGainRef.current.gain.value = 0.5; // Global volume
        masterGainRef.current.connect(ctx.destination);

        return ctx;
    };

    // --- INSTRUMENT SYNTHESIS ---

    const playSynthesizer = useCallback((
        ctx: AudioContext,
        time: number,
        freq: number,
        type: OscillatorType,
        duration: number,
        dest: GainNode,
        vol: number
    ) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, time);

        // Envelope (Bulletproof method for cross-browser web audio)
        // 1. Set to 0 immediately
        gain.gain.setValueAtTime(0, time);
        // 2. Attack: Ramp up to target volume quickly
        gain.gain.setTargetAtTime(vol, time, 0.02);
        // 3. Release: Let it ring for the duration then fade to 0
        gain.gain.setTargetAtTime(0, time + duration - 0.05, 0.05);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(time);
        osc.stop(time + duration);
    }, []);

    // --- CONTROL EXPORTS ---

    const playSfx = useCallback((type: "hover" | "click" | "up" | "down" | "start") => {
        if (isMuted || !audioCtxRef.current || !masterGainRef.current) return;
        const ctx = audioCtxRef.current;

        if (ctx.state === "suspended") ctx.resume();

        switch (type) {
            case "hover":
                playSynthesizer(ctx, ctx.currentTime, 440, "square", 0.1, masterGainRef.current, 0.05);
                break;
            case "click":
                playSynthesizer(ctx, ctx.currentTime, 880, "square", 0.1, masterGainRef.current, 0.1);
                break;
            case "up":
                playSynthesizer(ctx, ctx.currentTime, 1200, "square", 0.15, masterGainRef.current, 0.1);
                setTimeout(() => playSynthesizer(ctx, ctx.currentTime + 0.1, 1600, "square", 0.2, masterGainRef.current!, 0.1), 10);
                break;
            case "down":
                playSynthesizer(ctx, ctx.currentTime, 300, "sawtooth", 0.15, masterGainRef.current, 0.1);
                setTimeout(() => playSynthesizer(ctx, ctx.currentTime + 0.1, 200, "sawtooth", 0.2, masterGainRef.current!, 0.1), 10);
                break;
            case "start":
                [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                    setTimeout(() => playSynthesizer(ctx, ctx.currentTime + (i * 0.1), freq, "square", 0.2, masterGainRef.current!, 0.1), 10);
                });
                break;
        }
    }, [isMuted, playSynthesizer]);

    const toggleMute = useCallback(() => {
        // SYNCHRONOUS BROWSER UNLOCK: Must happen immediately on interaction (not inside state update queue)
        const ctx = initAudio();
        if (ctx.state === "suspended") {
            ctx.resume().then(() => {
                console.log("AudioContext resumed successfully on user interaction.");
            }).catch(e => console.error("Failed to resume AudioContext", e));
        }

        setIsMuted((prev) => !prev);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => { };
    }, []);

    return (
        <AudioContext.Provider value={{ isMuted, toggleMute, playSfx }}>
            {children}
        </AudioContext.Provider>
    );
}

// Custom hook to consume the Context
export function useAudio() {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error("useAudio must be used within an AudioProvider");
    }
    return context;
}

export function AudioToggle() {
    // Only used to demonstrate/export the audio component standalone if needed
    const { isMuted, toggleMute, playSfx } = useAudio();

    return (
        <ArcadeButton
            variant="danger"
            onClick={() => { playSfx("click"); toggleMute(); }}
            onMouseEnter={() => playSfx("hover")}
        >
            {isMuted ? "SND: OFF" : "SND: ON"}
        </ArcadeButton>
    );
}
