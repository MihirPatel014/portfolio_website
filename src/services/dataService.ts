import { PortfolioData } from '../types/portfolio';

/**
 * Service to fetch portfolio data from local JSON.
 */
export const getPortfolioData = async (): Promise<PortfolioData | null> => {
    try {
        const response = await fetch('/data/portfolio.json');
        if (!response.ok) {
            throw new Error('Failed to fetch portfolio data');
        }
        return await response.json();
    } catch (error) {
        console.error('DataService Error:', error);
        return null;
    }
};
