'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const router = express.Router();

//conexao banco
mongoose.connect('mongodb://bilhares:bilhares@ds040877.mlab.com:40877/ndstr', {
    useMongoClient: true,
    socketTimeoutMS: 0,
    keepAlive: true,
    reconnectTries: 30,
});
//carregar os modelos
const Product = require('./models/product');
const Customer = require('./models/customer');
//carrega as rotas
const indexRoute = require('./routes/index-route');
const productRoute = require('./routes/product-route')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', indexRoute);
app.use('/products', productRoute);

module.exports = app;

// {
// 	"title":"Max steel",
// 	"description":"Boneco max steel",
// 	"slug":"max-steel",
// 	"price":2000,
// 	"tags":["brinquedos", "infantil"]
// }