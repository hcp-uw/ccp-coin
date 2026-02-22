"use client";

import React, { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

type ButtonVariant = "primary" | "danger" | "success" | "warning" | "neutral";

interface ArcadeButtonProps extends Omit<HTMLMotionProps<"button">, "style"> {
    children: ReactNode;
    variant?: ButtonVariant;
    glow?: boolean;
}

const variantStyles: Record<ButtonVariant, {
    border: string;
    bg: string;
    text: string;
    shadow: string;
    hoverBg: string;
}> = {
    primary: {
        border: "border-primary",
        bg: "bg-primary/10",
        text: "text-primary",
        shadow: "rgba(0, 240, 255, 1)",
        hoverBg: "hover:bg-primary/20",
    },
    danger: {
        border: "border-danger",
        bg: "bg-danger/10",
        text: "text-danger",
        shadow: "rgba(255, 10, 30, 1)",
        hoverBg: "hover:bg-danger/20",
    },
    success: {
        border: "border-up",
        bg: "bg-up/10",
        text: "text-up",
        shadow: "rgba(0, 255, 65, 1)",
        hoverBg: "hover:bg-up/20",
    },
    warning: {
        border: "border-xp",
        bg: "bg-xp/20",
        text: "text-xp",
        shadow: "rgba(255, 215, 0, 1)",
        hoverBg: "hover:bg-xp/40",
    },
    neutral: {
        border: "border-white",
        bg: "bg-white/10",
        text: "text-white",
        shadow: "rgba(255, 255, 255, 0.4)",
        hoverBg: "hover:bg-white/20",
    },
};

export function ArcadeButton({
    children,
    variant = "neutral",
    glow = false,
    className = "",
    ...props
}: ArcadeButtonProps) {
    const styles = variantStyles[variant];

    return (
        <motion.button
            whileTap={{
                scale: 0.95,
                y: 2,
                boxShadow: "0px 0px 0px 0px transparent",
            }}
            initial={false}
            style={{
                boxShadow: `4px 4px 0px 0px ${styles.shadow}`,
            }}
            className={`
        border-[2px] 
        ${styles.border} 
        ${styles.bg} 
        ${styles.text} 
        ${styles.hoverBg}
        px-4 py-2 
        font-arcade 
        text-[10px] 
        uppercase 
        transition-colors 
        ${glow ? "shadow-glow" : ""}
        ${className}
      `}
            {...props}
        >
            {children}
        </motion.button>
    );
}
