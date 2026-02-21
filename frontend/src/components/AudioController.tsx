"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { FiVolumeX, FiVolume2 } from "react-icons/fi";

type AudioContextType = {
  isMuted: boolean;
  toggleMute: () => void;
  playSfx: (type: "hover" | "click" | "up" | "down" | "start") => void;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  // Start muted to respect autoplay policies
  const [isMuted, setIsMuted] = useState(true);

  // We are not importing actual audio files yet; we will synthesize retro sounds
  // using the Web Audio API for a true arcade feel.
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Only initialize on user interaction to comply with browser policies
    if (!isMuted && !audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted && !audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playSynth = (frequency: number, type: OscillatorType, duration: number, vol = 0.1) => {
    if (isMuted || !audioCtxRef.current) return;

    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(vol, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  };

  const playSfx = (type: "hover" | "click" | "up" | "down" | "start") => {
    if (isMuted) return;

    switch (type) {
      case "hover":
        playSynth(440, "square", 0.1, 0.05);
        break;
      case "click":
        playSynth(880, "square", 0.1, 0.1);
        break;
      case "up":
        playSynth(1200, "square", 0.2, 0.15); // High pitch for up
        setTimeout(() => playSynth(1600, "square", 0.3, 0.15), 100);
        break;
      case "down":
        playSynth(300, "sawtooth", 0.2, 0.15); // Low pitch for down
        setTimeout(() => playSynth(200, "sawtooth", 0.3, 0.15), 100);
        break;
      case "start":
        // A mini arpeggio for "Start"
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          setTimeout(() => playSynth(freq, "square", 0.2, 0.1), i * 100);
        });
        break;
    }
  };

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, playSfx }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}

export function AudioToggle() {
  const { isMuted, toggleMute, playSfx } = useAudio();

  return (
    <button
      onClick={() => {
        toggleMute();
        if (isMuted) playSfx("start"); // Play sound when unmuting
      }}
      className="flex items-center gap-2 rounded-none border-[2px] border-primary bg-obsidian px-3 py-1 font-arcade text-[10px] text-primary transition-colors hover:bg-primary hover:text-obsidian"
      aria-label={isMuted ? "Unmute sound" : "Mute sound"}
    >
      {isMuted ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
      <span className="hidden sm:inline">{isMuted ? "SND: OFF" : "SND: ON"}</span>
    </button>
  );
}
