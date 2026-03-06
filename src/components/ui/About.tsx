import React from 'react';
import { FileText } from 'lucide-react';
import { LogoLoop, LogoItem } from './LogoLoop';
import { cn } from '../../lib/utils';

interface AboutProps {
    name: string;
    bio: string;
    image?: string;
    className?: string;
}

const About: React.FC<AboutProps> = ({ name, bio, image, className }) => {
    // Tech stack logos
    const techLogos: LogoItem[] = [
        { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", alt: "React" },
        { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", alt: "TypeScript" },
        { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg", alt: "Tailwind CSS" },
        { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", alt: "Node.js" },
        { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg", alt: "Vite" },
        { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original-wordmark.svg", alt: "Next.js" },
        { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", alt: "JavaScript" },
        { src: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/greensock.svg", alt: "GSAP" },
        { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", alt: "PostgreSQL" },
        { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", alt: "Git" },
    ];

    return (
        <section
            id="about"
            className={cn("py-24 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden", className)}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Image Column */}
                <div className="relative group order-1 pb-10 sm:pb-0">
                    <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] rotate-3 transition-transform group-hover:rotate-0 duration-500" />
                    <div className="relative aspect-square overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl bg-neutral-800">
                        {image ? (
                            <img
                                src={image}
                                alt={`${name} - Full Stack Developer Profile`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement?.classList.add('bg-neutral-800');
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/5 text-8xl font-black">
                                {name.charAt(0)}
                            </div>
                        )}
                    </div>
                    {/* Floating Badge */}
                    <div className="absolute -bottom-6 -right-6 md:-right-10 bg-card border border-border p-4 sm:p-6 rounded-2xl shadow-xl backdrop-blur-md block">
                        <div className="text-3xl font-bold text-primary mb-1">3+ Years</div>
                        <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Professional Experience</div>
                    </div>
                </div>

                {/* Content Column */}
                <div className="space-y-8 order-2">
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold tracking-[0.2em] text-primary uppercase">
                            Who I Am
                        </h2>
                        <h3 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
                            Crafting High-Performance <br />
                            <span className="text-neutral-500">Digital Experiences.</span>
                        </h3>
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            {bio}
                        </p>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            My focus is on the intersection of <strong>Design</strong> and <strong>Technology</strong>. I believe that a great product is not just about the code, but about how it feels to the user. I'm constantly exploring new tools and methodologies to push the boundaries of what's possible on the web.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <a
                            href="/portfolio.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform group-hover:translate-y-0" />
                            <FileText className="w-5 h-5" />
                            <span className="relative">View Resume</span>
                        </a>
                    </div>

                    <div className="space-y-6 pt-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                            My Technology Arsenal
                        </h4>
                        <div className="bg-neutral-100/50 dark:bg-neutral-900/50 rounded-2xl p-4 border border-border">
                            <LogoLoop
                                logos={techLogos}
                                speed={40}
                                logoHeight={28}
                                gap={40}
                                fadeOut={true}
                                fadeOutColor="var(--background)"
                                className="transition-opacity"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
