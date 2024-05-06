import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();


const client = new MongoClient(process.env.MONGODB_URI);

await client.connect();

const db = client.db(process.env.DB_NAME);

const User = db.collection('users');
const transactions = db.collection('transactions');
const planner = db.collection('planners');
const installments = db.collection('Installement_days');
const temp = db.collection('temp');

export { User , transactions , planner , installments , temp };