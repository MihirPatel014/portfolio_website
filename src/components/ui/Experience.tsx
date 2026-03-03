import React from 'react';
import { ExperienceEntry } from '../../types/portfolio';
import { cn } from '../../lib/utils';

interface ExperienceProps {
    experiences: ExperienceEntry[];
    className?: string;
}

const Experience: React.FC<ExperienceProps> = ({ experiences, className }) => {
    return (
        <section
            id="experience"
            className={cn("py-24 px-4 md:px-8 max-w-5xl mx-auto", className)}
        >
            <div className="space-y-4 mb-16 text-center lg:text-left">
                <h2 className="text-sm font-bold tracking-[0.2em] text-primary uppercase">
                    My Journey
                </h2>
                <h3 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
                    Professional <br />
                    <span className="text-neutral-500">Milestones.</span>
                </h3>
            </div>

            <div className="relative space-y-12 before:absolute before:inset-y-0 before:left-0 before:md:left-1/2 before:-translate-x-px before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {experiences.map((exp, index) => (
                    <div
                        key={`${exp.company}-${index}`}
                        className={cn(
                            "relative flex flex-col md:flex-row items-center",
                            index % 2 === 0 ? "md:flex-row-reverse" : ""
                        )}
                    >
                        {/* Dot */}
                        <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-background border-4 border-primary z-10 hidden md:block" />

                        {/* Content Card */}
                        <div className={cn(
                            "w-full md:w-[45%] p-8 rounded-[2rem] bg-card border border-border shadow-lg transition-transform hover:scale-[1.02] duration-300",
                            index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"
                        )}>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <div>
                                    <h4 className="text-2xl font-bold text-foreground">{exp.company}</h4>
                                    <p className="text-primary font-medium">{exp.role}</p>
                                </div>
                                <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                                    {exp.duration}
                                </span>
                            </div>

                            <ul className="space-y-3">
                                {exp.highlights.map((highlight, hIdx) => (
                                    <li key={hIdx} className="flex gap-3 text-muted-foreground leading-relaxed">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2.5" />
                                        <span>{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Experience;
