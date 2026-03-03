import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Project } from '../../types/portfolio';
import { cn } from '../../lib/utils';
import { Github, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface StackedCardsProps {
    projects: Project[];
    className?: string;
}

const StackedCards: React.FC<StackedCardsProps> = ({ projects, className }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsContainerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        if (!containerRef.current || !cardsContainerRef.current || cardsRef.current.length === 0) return;

        const totalCards = cardsRef.current.length;

        // Pin the container
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: `+=${totalCards * 100}%`,
                pin: true,
                scrub: 1,
                // markers: true, // Uncomment for debugging
            }
        });

        // Loop through cards to create stacking effect
        cardsRef.current.forEach((card, index) => {
            if (!card) return;

            if (index > 0) {
                // Animate entry from bottom
                tl.fromTo(card,
                    { yPercent: 100, opacity: 0 },
                    { yPercent: 0, opacity: 1, duration: 1, ease: "none" },
                    `card-${index}`
                );

                // Simultaneously scale down the previous card
                const prevCard = cardsRef.current[index - 1];
                if (prevCard) {
                    tl.to(prevCard, {
                        scale: 0.95 - (index * 0.02), // Accumulate scaling
                        opacity: 0.6,
                        yPercent: -10, // Move it up slightly
                        duration: 1,
                        ease: "none"
                    }, `card-${index}`);
                }

                // If there are cards before the previous one, keep them shrinking/fading
                for (let i = 0; i < index - 1; i++) {
                    const olderCard = cardsRef.current[i];
                    if (olderCard) {
                        tl.to(olderCard, {
                            scale: 0.95 - (index * 0.02) - ((index - i) * 0.01),
                            opacity: 0.4 / (index - i),
                            duration: 1,
                            ease: "none"
                        }, `card-${index}`);
                    }
                }
            }
        });

    }, { scope: containerRef, dependencies: [projects] });

    return (
        <div ref={containerRef} className={cn("relative w-full overflow-hidden", className)}>
            <div className="max-w-7xl mx-auto px-4 pt-20 pb-10 text-center">
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-foreground mb-4">
                    Featured Projects
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-12">
                    A selection of my favorite works, spanning web development, design, and experimental code.
                </p>
            </div>

            <div
                ref={cardsContainerRef}
                className="relative flex items-center justify-center min-h-[80vh] w-full"
            >
                {projects.map((project, index) => (
                    <div
                        key={project.id}
                        ref={el => { cardsRef.current[index] = el; }}
                        className={cn(
                            "absolute w-[92%] max-w-5xl h-[60vh] md:h-[70vh] rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-stretch overflow-hidden border border-white/10 group bg-card",
                            index === 0 ? "relative" : "top-0"
                        )}
                        style={{
                            zIndex: index + 1,
                        }}
                    >
                        {/* Background Overlay with Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/10 pointer-events-none" />

                        {/* Project Visual / Thumbnail Placeholder */}
                        <div className="w-full md:w-1/2 bg-neutral-900 overflow-hidden relative border-b md:border-b-0 md:border-r border-white/10">
                            {project.image ? (
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-8xl font-black text-white/5 uppercase select-none">
                                    {project.title.charAt(0)}
                                </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 p-8 pt-20 bg-gradient-to-t from-black/80 to-transparent">
                                <div className="flex gap-4">
                                    {project.links.github && (
                                        <a href={project.links.github} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white backdrop-blur-md border border-white/10">
                                            <Github className="w-5 h-5" />
                                        </a>
                                    )}
                                    {project.links.live && (
                                        <a href={project.links.live} className="p-3 bg-primary hover:bg-primary/80 rounded-full transition-colors text-white shadow-lg shadow-primary/20">
                                            <ExternalLink className="w-5 h-5" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Project Info */}
                        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative z-10">
                            <span className="text-primary font-bold tracking-widest text-xs uppercase mb-3">
                                {project.status === 'active' ? 'Recent Project' : 'Archived'}
                            </span>
                            <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                                {project.title}
                            </h3>
                            <p className="text-muted-foreground text-lg mb-8 line-clamp-4 leading-relaxed">
                                {project.description}
                            </p>

                            <div className="mt-auto">
                                <div className="flex flex-wrap gap-2">
                                    {project.techStack.map(tech => (
                                        <span
                                            key={tech}
                                            className="px-4 py-1.5 bg-secondary text-secondary-foreground text-[10px] md:text-xs font-bold rounded-full border border-border tracking-wider uppercase"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Padding for Scroll Space */}
            <div className="h-[20vh]" />
        </div>
    );
};

export default StackedCards;
