"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface PreloaderProps {
    progress: number;
    isComplete: boolean;
}

const Preloader: React.FC<PreloaderProps> = ({ progress, isComplete }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLDivElement>(null);
    const progressLineRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (isComplete) {
            const tl = gsap.timeline();
            tl.to(counterRef.current, {
                y: -100,
                opacity: 0,
                duration: 0.8,
                ease: "power4.inOut"
            })
                .to(containerRef.current, {
                    yPercent: -100,
                    duration: 1.2,
                    ease: "power4.inOut"
                }, "-=0.4");
        }
    }, { dependencies: [isComplete], scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-foreground"
        >
            <div className="relative mb-8">
                <div
                    ref={counterRef}
                    className="text-8xl md:text-9xl font-black italic tracking-tighter flex items-baseline"
                >
                    <span className="inline-block tabular-nums">
                        {Math.round(progress)}
                    </span>
                    <span className="text-4xl md:text-5xl ml-2 font-bold not-italic text-primary">%</span>
                </div>
            </div>

            <div className="w-6 h-[2px] bg-neutral-200 dark:bg-neutral-800 relative overflow-hidden">
                <div
                    className="absolute inset-y-0 left-0 bg-primary transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="mt-6 text-xs uppercase tracking-[0.3em] font-medium text-muted-foreground animate-pulse">
                INITIALIZING PORTFOLIO
            </div>


        </div>
    );
};

export default Preloader;
