const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGODB_URI || "mongodb+srv://admin:ixEFq7R4sq4pJzM@635menacant-93nk0.mongodb.net/test?retryWrites=true&w=majority";

const database = null;

const connectToDatabase = async function() {
    if (database) return database;
    const client = await MongoClient.connect(uri, { useNewUrlParser: true });
    const db = client.db("Poster");
    database = db;
    return db;
}

module.exports = connectToDatabase;