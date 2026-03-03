import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import BubbleMenu from './BubbleMenu';

interface NavbarProps {
    isDark: boolean;
    toggleTheme: () => void;
    showEffect: boolean;
    setShowEffect: (show: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDark, toggleTheme, showEffect, setShowEffect }) => {
    // Signature component for the logo
    const Signature = (
        <div className="text-3xl md:text-4xl text-primary" style={{ fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive" }}>
            M
        </div>
    );

    return (
        <div className="fixed inset-0 z-[1001] pointer-events-none">
            <BubbleMenu
                logo={Signature}
                menuBg="var(--card)"
                menuContentColor="var(--foreground)"
                className="!top-4 md:!top-8"
            />

            {/* Theme and Effect Toggles */}
            <div className="absolute top-4 md:top-8 right-16 md:right-24 flex items-center gap-2 md:gap-3 z-[1002] pointer-events-auto scale-90 md:scale-100">
                {/* Antigravity Toggle */}
                <div className="flex items-center gap-2 bg-card/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/50 shadow-sm transition-all duration-300 hover:border-primary/30">
                    <Sparkles className={cn("w-3.5 h-3.5 transition-colors duration-300", showEffect ? "text-primary" : "text-muted-foreground")} />
                    <button
                        type="button"
                        onClick={() => setShowEffect(!showEffect)}
                        className="relative w-10 h-6 rounded-full transition-all duration-300 cursor-pointer"
                        style={{
                            backgroundColor: showEffect ? "var(--primary)" : (isDark ? "var(--neutral-800)" : "var(--neutral-200)")
                        }}
                        aria-label="Toggle Antigravity effect"
                    >
                        <div
                            className={cn(
                                "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-md",
                                showEffect && "translate-x-4"
                            )}
                        />
                    </button>
                </div>

                {/* Theme Toggle */}
                <div className="flex items-center gap-2 bg-card/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/50 shadow-sm transition-all duration-300 hover:border-primary/30">
                    <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                        {isDark ? (
                            <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(232,190,69,0.5)]" />
                            </div>
                        ) : (
                            <div className="w-full h-full rounded-full border-2 border-muted-foreground/50 transition-colors" />
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="relative w-10 h-6 rounded-full transition-all duration-300 cursor-pointer"
                        style={{
                            backgroundColor: isDark ? "var(--primary)" : (isDark ? "var(--neutral-800)" : "var(--neutral-200)")
                        }}
                        aria-label="Toggle theme"
                    >
                        <div
                            className={cn(
                                "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-md",
                                isDark && "translate-x-4"
                            )}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
