"use client";

import React, { useEffect, useState } from 'react';
import { getPortfolioData } from '../services/dataService';
import { PortfolioData } from '../types/portfolio';
import PortfolioHero from '../components/ui/PortfolioHero';
import StackedCards from '../components/ui/StackedCards';
import About from '../components/ui/About';
import Experience from '../components/ui/Experience';
import ContactForm from '../components/ui/ContactForm';
import InfiniteMenu, { MenuItem } from '../components/ui/InfiniteMenu';
import Preloader from '../components/ui/Preloader';
import gsap from 'gsap';

// Local Social Icons (Using absolute paths for public assets)
const githubIcon = '/assets/github.png';
const instaIcon = '/assets/insta.png';
const twitterIcon = '/assets/twitter.png';
const linkedinIcon = '/assets/linkedin.png';

const Home: React.FC = () => {
    const [data, setData] = useState<PortfolioData | null>(null);
    const [loading, setLoading] = useState(true);
    const [showPreloader, setShowPreloader] = useState(true);
    const [progress, setProgress] = useState(0);
    const [socialScale, setSocialScale] = useState(typeof window !== 'undefined' && window.innerWidth < 768 ? 1.2 : 0.8);

    useEffect(() => {
        const handleResize = () => {
            setSocialScale(window.innerWidth < 768 ? 1.2 : 0.8);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Start fetching data
        const dataPromise = getPortfolioData();

        // Rate limiting logic: Max 3 times per minute
        const now = Date.now();
        const statsStr = localStorage.getItem('preloader_stats');
        let stats = statsStr ? JSON.parse(statsStr) : { count: 0, firstTime: now };

        // Reset if minute has passed
        if (now - stats.firstTime > 60000) {
            stats = { count: 1, firstTime: now };
        } else {
            stats.count += 1;
        }
        localStorage.setItem('preloader_stats', JSON.stringify(stats));

        const shouldShowLongLoad = stats.count <= 3;
        const loadDuration = shouldShowLongLoad ? 3 : 0.5; // Fast forward if frequent reloads

        // GSAP counter animation
        const ctx = gsap.context(() => {
            gsap.to({}, {
                duration: loadDuration,
                onUpdate: function () {
                    const p = Math.round(this.progress() * 100);
                    setProgress(p);
                },
                onComplete: () => {
                    dataPromise.then((resp) => {
                        setData(resp);
                        // 🔒 FROZEN FOR INSPECTION — uncomment to restore normal behaviour
                        const finalDelay = shouldShowLongLoad ? 500 : 0;
                        setTimeout(() => {
                            setLoading(false);
                            setTimeout(() => setShowPreloader(false), 1400);
                        }, finalDelay);
                    });
                }
            });
        });

        return () => ctx.revert();
    }, []);

    if (!data) {
        // Data not yet available — show only the preloader, nothing to render behind
        return <Preloader progress={progress} isComplete={false} />;
    }

    const { projects, skills, experience } = data;

    return (
        <>
            {/* Preloader sits on top (z-100 fixed) while content renders underneath.
                Removed from DOM only after exit animation fully completes. */}
            {showPreloader && (
                <Preloader progress={progress} isComplete={!loading} />
            )}

            <div className="bg-background text-foreground transition-colors overflow-x-hidden">
                {/* Premium Hero Integration */}
                <section id="hero">
                    <PortfolioHero />
                </section>

                <div className="max-w-6xl mx-auto px-4 py-32 space-y-32">
                    {/* About Section */}
                    <section id="about">
                        <About
                            name={data.personal.name}
                            bio={data.personal.bio || ""}
                            image={data.personal.aboutImage}
                        />
                    </section>

                    {/* Experience Section */}
                    <section id="experience">
                        <Experience experiences={data.experience} />
                    </section>

                    <section id="projects">
                        <StackedCards projects={projects} />
                    </section>
                    {/* Social Media Infinite Menu */}
                    <section id="social" className="py-24 space-y-12">
                        <div className="space-y-4 text-center">
                            <h2 className="text-sm font-bold tracking-[0.2em] text-primary uppercase">Connect</h2>
                            <h3 className="text-4xl font-black tracking-tight">Across the Web</h3>
                        </div>
                        <div className="h-[300px] w-full border-y border-border/50 bg-neutral-100/30 dark:bg-neutral-900/30">
                            <InfiniteMenu
                                items={data.personal.socialLinks.map(link => {
                                    const platform = link.platform.toLowerCase();
                                    let icon = githubIcon;

                                    if (platform === 'linkedin') icon = linkedinIcon;
                                    if (platform === 'twitter' || platform === 'x') icon = twitterIcon;
                                    if (platform === 'instagram' || platform === 'insta') icon = instaIcon;
                                    if (platform === 'github') icon = githubIcon;

                                    return {
                                        image: icon,
                                        link: link.url,
                                        title: link.platform,
                                        description: `Connect with me on ${link.platform}`
                                    };
                                }) as MenuItem[]}
                                scale={socialScale}
                            />
                        </div>
                    </section>
                    {/* Contact Section */}
                    <section id="contact">
                        <ContactForm />
                    </section>


                </div>
            </div>
        </>
    );
};

export default Home;
