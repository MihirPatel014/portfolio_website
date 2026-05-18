"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "../../lib/utils";
import { getPortfolioData } from "../../services/dataService";
import { PortfolioData } from "../../types/portfolio";
import Antigravity from "./Antigravity";
import Navbar from "./Navbar";

// Inline Button component
const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ className = "", children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

// BlurText animation component
interface BlurTextProps {
    text: string;
    delay?: number;
    animateBy?: "words" | "letters";
    direction?: "top" | "bottom";
    className?: string;
    style?: React.CSSProperties;
}

const BlurText: React.FC<BlurTextProps> = ({
    text,
    delay = 50,
    animateBy = "words",
    direction = "top",
    className = "",
    style,
}) => {
    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    const segments = useMemo(() => {
        return animateBy === "words" ? text.split(" ") : text.split("");
    }, [text, animateBy]);

    return (
        <p ref={ref} className={cn("inline-flex flex-wrap", className)} style={style}>
            {segments.map((segment, i) => (
                <span
                    key={i}
                    style={{
                        display: "inline-block",
                        filter: inView ? "blur(0px)" : "blur(10px)",
                        opacity: inView ? 1 : 0,
                        transform: inView ? "translateY(0)" : `translateY(${direction === "top" ? "-20px" : "20px"})`,
                        transition: `all 0.5s ease-out ${i * delay}ms`,
                    }}
                >
                    {segment}
                    {animateBy === "words" && i < segments.length - 1 ? "\u00A0" : ""}
                </span>
            ))}
        </p>
    );
};

export default function PortfolioHero() {
    const [data, setData] = useState<PortfolioData | null>(null);
    const [isDark, setIsDark] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showEffect, setShowEffect] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        getPortfolioData().then(setData);
        // Apply stored theme on mount instead of always forcing dark
        const saved = localStorage.getItem('portfolio-theme');
        const prefersDark = saved !== null ? saved === 'dark' : true;
        setIsDark(prefersDark);
        if (prefersDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isMenuOpen &&
                menuRef.current &&
                buttonRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMenuOpen]);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        localStorage.setItem('portfolio-theme', newTheme ? 'dark' : 'light');
        if (newTheme) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const menuItems = [
        { label: "HOME", href: "#hero", highlight: true },
        { label: "ABOUT", href: "#about" },
        { label: "EXPERIENCE", href: "#experience" },
        { label: "PROJECTS", href: "#projects" },
        { label: "CONTACT", href: "#contact" },
    ];

    return (
        <div
            className="min-h-screen text-foreground transition-colors overflow-x-hidden"
            style={{
                backgroundColor: isDark ? "var(--background)" : "var(--background)",
                color: isDark ? "var(--foreground)" : "var(--foreground)",
            }}
        >
            <Navbar
                isDark={isDark}
                toggleTheme={toggleTheme}
                showEffect={showEffect}
                setShowEffect={setShowEffect}
            />

            {/* Hero Section */}
            <main className="relative min-h-screen flex flex-col">
                {/* Antigravity Effect Background */}
                {showEffect && (
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
                        <Antigravity
                            isDark={isDark}
                            count={600}
                            magnetRadius={18}
                            ringRadius={14}
                            particleSize={1}
                            autoAnimate={true}
                        />
                    </div>
                )}
                {/* Content Container - Always Perfectly Centered */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4 flex flex-col items-center justify-center gap-8 md:gap-12">
                    <div className="relative text-center">
                        {data?.personal.name ? (
                            <>
                                <div>
                                    <BlurText
                                        text={data.personal.name.split(" ")[0].toUpperCase()}
                                        delay={100}
                                        animateBy="letters"
                                        direction="top"
                                        className="font-bold text-[80px] sm:text-[120px] md:text-[150px] lg:text-[150px] xl:text-[200px] leading-[0.75] tracking-tighter uppercase justify-center whitespace-nowrap"
                                        style={{ color: "var(--primary)", fontFamily: "'Fira Code', monospace" }}
                                    />
                                </div>
                                {data.personal.name.split(" ").length > 1 && (
                                    <div>
                                        <BlurText
                                            text={data.personal.name.split(" ")[1].toUpperCase()}
                                            delay={100}
                                            animateBy="letters"
                                            direction="top"
                                            className="font-bold text-[80px] sm:text-[120px] md:text-[150px] lg:text-[150px] xl:text-[200px] leading-[0.75] tracking-tighter uppercase justify-center whitespace-nowrap"
                                            style={{ color: "var(--primary)", fontFamily: "'Fira Code', monospace" }}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div>
                                    <BlurText
                                        text="ALEX"
                                        delay={100}
                                        animateBy="letters"
                                        direction="top"
                                        className="font-bold text-[80px] sm:text-[120px] md:text-[150px] lg:text-[150px] xl:text-[200px] leading-[0.75] tracking-tighter uppercase justify-center whitespace-nowrap"
                                        style={{ color: "var(--primary)", fontFamily: "'Fira Code', monospace" }}
                                    />
                                </div>
                                <div>
                                    <BlurText
                                        text="KANE"
                                        delay={100}
                                        animateBy="letters"
                                        direction="top"
                                        className="font-bold text-[80px] sm:text-[120px] md:text-[150px] lg:text-[150px] xl:text-[200px] leading-[0.75] tracking-tighter uppercase justify-center whitespace-nowrap"
                                        style={{ color: "var(--primary)", fontFamily: "'Fira Code', monospace" }}
                                    />
                                </div>
                            </>
                        )}

                        {/* Profile Picture */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                            <div className="w-[65px] h-[110px] sm:w-[90px] sm:h-[152px] md:w-[110px] md:h-[185px] lg:w-[129px] lg:h-[218px] rounded-full overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-110 cursor-pointer border-2 border-[var(--primary)]/20">
                                {data?.personal.profileImage ? (
                                    <img
                                        src={data.personal.profileImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.parentElement?.classList.add('bg-neutral-800');
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-white/10 text-4xl font-black">
                                        {data?.personal.name?.charAt(0) || 'M'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tagline - Proper Distance Below Hero */}
                    <div className="relative w-full px-6 flex justify-center mt-4 sm:mt-8">
                        <BlurText
                            text={data?.personal.tagline || "Designing human experiences in code."}
                            delay={150}
                            animateBy="words"
                            direction="top"
                            className="text-[15px] sm:text-[18px] md:text-[20px] lg:text-[22px] text-center transition-colors duration-300 text-neutral-500 hover:text-foreground"
                            style={{ fontFamily: "'Antic', sans-serif" }}
                        />
                    </div>
                </div>

                {/* Scroll Indicator */}
                <button
                    type="button"
                    className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 transition-colors duration-300"
                    aria-label="Scroll down"
                >
                    <ChevronDown className="w-5 h-5 md:w-8 md:h-8 text-neutral-500 hover:text-black dark:hover:text-white transition-colors duration-300" />
                </button>
            </main>
        </div>
    );
}
