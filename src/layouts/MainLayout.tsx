import React from 'react';
import { Outlet } from '@tanstack/react-router';

/**
 * Main Layout wrapper. 
 * Header is handled by specific pages (like Hero) or added back conditionally.
 */
const MainLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
            <main>
                <Outlet />
            </main>

            <footer className="mt-20 border-t border-border py-10 bg-muted/30">
                <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Mihir. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
