import axios from 'axios';
import dotenv from 'dotenv';
import { temp } from '../models/database.js';
dotenv.config();


const getTopStocksWithRetry = async (maxRetries = 2) => {
    let retries = 0;

    const axiosInstance = axios.create({
        timeout: 10000, // Set timeout to 10 seconds
    });

    while (retries < maxRetries) {
        try {
            const apiKey = process.env.STOCK_API;
            const apiUrl = `https://financialmodelingprep.com/api/v3/stock_market/actives?apikey=${apiKey}`;

            const response = await axiosInstance.get(apiUrl);
            
            if (!response.data || !response.data.length) {
                throw new Error('No data received from the API');
            }

            const top = response.data;
           

            return top;
        } catch (error) {
            console.error(`Error fetching top stocks (Attempt ${retries + 1}):`, error);
            retries++;
        }
    }

    console.log('Max retries reached. Failed to fetch top stocks.');
    
    // fetching temp data from DB if API server not responding

    const result = await temp.findOne({uid:1});
    return result.stocks ;
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
