const {MongoClient}=require('mongodb');
const client= new MongoClient(process.env.MONGO_URI);
await client.connect();
const db=client.db(process.env.DB_NAME);

module.exports={
    User:db.collection('users')
};