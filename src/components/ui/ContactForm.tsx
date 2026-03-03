import React, { useState } from 'react';
import { cn } from '../../lib/utils';

const SHEETDB_API = 'https://sheetdb.io/api/v1/lrzw7muvoemug';

const ContactForm: React.FC<{ className?: string }> = ({ className }) => {
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (status === 'error') setStatus('idle');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setErrorMsg('');

        try {
            const res = await fetch(SHEETDB_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: [{
                        Name: form.name,
                        email: form.email,
                        message: form.message,
                        Timestamp: 'DATETIME',
                    }]
                }),
            });

            if (!res.ok) throw new Error(`Server error: ${res.status}`);

            setStatus('sent');
            setForm({ name: '', email: '', message: '' });

            // Reset back to idle after 5 seconds so user can send another message
            setTimeout(() => setStatus('idle'), 5000);
        } catch (err) {
            setStatus('error');
            setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        }
    };

    return (
        <section id="contact" className={cn("py-24 px-4 md:px-8 max-w-4xl mx-auto", className)}>
            <div className="space-y-4 mb-12 text-center">
                <h2 className="text-sm font-bold tracking-[0.2em] text-primary uppercase">
                    Get In Touch
                </h2>
                <h3 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
                    Let's Build Something <br />
                    <span className="text-neutral-500">Together.</span>
                </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                            Name
                        </label>
                        <input
                            required
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            disabled={status === 'sending' || status === 'sent'}
                            className="w-full bg-neutral-100 dark:bg-neutral-900 border border-border focus:border-primary outline-none px-6 py-4 rounded-2xl transition-all disabled:opacity-50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                            Email
                        </label>
                        <input
                            required
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            disabled={status === 'sending' || status === 'sent'}
                            className="w-full bg-neutral-100 dark:bg-neutral-900 border border-border focus:border-primary outline-none px-6 py-4 rounded-2xl transition-all disabled:opacity-50"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                        Message
                    </label>
                    <textarea
                        required
                        rows={6}
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="How can I help you?"
                        disabled={status === 'sending' || status === 'sent'}
                        className="w-full bg-neutral-100 dark:bg-neutral-900 border border-border focus:border-primary outline-none px-6 py-4 rounded-2xl resize-none transition-all disabled:opacity-50"
                    />
                </div>

                {/* Error message */}
                {status === 'error' && errorMsg && (
                    <p className="text-center text-sm text-destructive font-medium">{errorMsg}</p>
                )}

                <div className="flex justify-center pt-4">
                    <button
                        type="submit"
                        disabled={status === 'sending' || status === 'sent'}
                        className={cn(
                            "group relative px-12 py-5 font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100",
                            status === 'sent'
                                ? "bg-green-500 text-white"
                                : status === 'error'
                                    ? "bg-destructive text-white"
                                    : "bg-foreground text-background"
                        )}
                    >
                        <span className="relative z-10">
                            {status === 'idle' && 'Send Message'}
                            {status === 'sending' && (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Sending...
                                </span>
                            )}
                            {status === 'sent' && '✓ Message Sent!'}
                            {status === 'error' && 'Try Again'}
                        </span>
                        {/* Hover shimmer — only on idle */}
                        {status === 'idle' && (
                            <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        )}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default ContactForm;
