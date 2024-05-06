import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const getTopStocksWithRetry = async (maxRetries = 3) => {
    let retries = 0;

    while (retries < maxRetries) {
        try {
            const apiKey = process.env.STOCK_API;
            const apiUrl = `https://financialmodelingprep.com/api/v3/stock/actives?apikey=${apiKey}`;

            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const activeStocks = await response.json();
    

//            const response = await axios.get(apiUrl);
            const topStocks = response.data.mostActiveStock;

            const formattedStocks = topStocks.map(stock => ({
                symbol: stock.ticker,
                companyName: stock.companyName,
                price: stock.price,
                changes: stock.changes,
                changesPercentage: stock.changesPercentage,
            }));

            return formattedStocks;
        } catch (error) {
            console.error(`Error fetching top stocks (Attempt ${retries + 1}):`, error);
            retries++;
        }
    }

    console.log('Max retries reached. Failed to fetch top stocks.');
    return null;
};

const getTopStocks = async (req, res) => {
    try {
        const topStocks = await getTopStocksWithRetry();
        res.json({ topStocks });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch top stocks.' });
    }
};

export { getTopStocks };
