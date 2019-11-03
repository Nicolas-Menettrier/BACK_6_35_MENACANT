const { ApolloServer } = require('apollo-server-express');
const bodyParser = require('body-parser');
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const SHA256 = require('crypto-js/sha256');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers/resolvers');

let database = require('./database/database');

const app = express();
const secret = Date.now().toString();

app.use(bodyParser.json());
app.use(cors());

app.post('/api/authentication', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'body values are incorrect' });
    const user = await database.collection("users").findOne({ email, "password": SHA256(password)})
    if (!user) return res.status(401).json({ message: 'wrong email or password' });
    const token = jwt.sign(user, secret, { expiresIn: '3600s' });
    return res.json({ token });
});

app.post('/api/registration', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'body values are incorrect' });
    if (await database.collection("users").findOne({ $or: [{email}, {username}] }))
        return res.status(401).json({ message: 'username or email already in use' });
    const user = {
        'id': database.users[database.users.length - 1].id + 1,
        'username': username,
        'email': email,
        'description': null,
        'password': SHA256(password),
        'mode': 0
    };
    database.collection("users").insertOne(user);
    return res.json(user);
});

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const { token } = req.headers;
        if (!token) throw new AuthenticationError('header values are incorrect');
        const user = jwt.verify(token, secret);
        if (!user) throw new AuthenticationError('you must be logged in');
        return { user };
    }
});

server.applyMiddleware({ app });

const port = process.env.API_PORT || 8080;

app.listen({ port }, () => {
    console.log(`Listening on port ${port}`);
});