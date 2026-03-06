import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Demo from './pages/Demo';

const rootRoute = createRootRoute({
    component: MainLayout,
});

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: Home,
});

const demoRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/demo',
    component: Demo,
});

const portfolioRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/portfolio',
    beforeLoad: () => {
        window.open('/portfolio.pdf', '_blank');
        throw { type: 'redirect', to: '/' };
    },
});

const routeTree = rootRoute.addChildren([indexRoute, demoRoute, portfolioRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}
