"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PortfolioPage() {
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.open('/portfolio.pdf', '_blank');
            router.push('/');
        }
    }, [router]);

    return null;
}
