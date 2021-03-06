const express = require('express');
const bodyParser = require('body-parser');
const graphqlhttp = require('express-graphql');
const mongoose = require('mongoose');


const app = express();
const port = 9805;

const graphqlSchema = require('./graphql/schema/index.js');
const graphqlResolvers = require('./graphql/resolvers/index.js');
const isAuth = require('./middleware/isAuth.js');
const mongoAtlasUrl = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0-zaynt.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
});

app.use(isAuth);

app.use('/graphql', graphqlhttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
}));
mongoose.connect('mongodb://mongo:27017/eventbooker').then(() => {
    console.log("DB conncected");
    app.listen(port, () => {
        console.log("Server running at port: " + port);
    })
}).catch(err => {
    console.log(err);
    throw err;
});
