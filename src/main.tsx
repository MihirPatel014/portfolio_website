import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Analytics } from "@vercel/analytics/react"
const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <App />
            <Analytics />
        </React.StrictMode>,
    );
}
