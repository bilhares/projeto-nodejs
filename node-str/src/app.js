'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config')

const app = express();
const router = express.Router();

//conexao banco
mongoose.connect(config.connectionString, {
    useMongoClient: true,
    socketTimeoutMS: 0,
    keepAlive: true,
    reconnectTries: 30,
});
//carregar os modelos
const Product = require('./models/product');
const Customer = require('./models/customer');
const Order = require('./models/order');
//carrega as rotas
const indexRoute = require('./routes/index-route');
const productRoute = require('./routes/product-route')
const customerRoute = require('./routes/customer-route')
const orderRoute = require('./routes/order-route')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', indexRoute);
app.use('/products', productRoute);
app.use('/customers', customerRoute);
app.use('/orders', orderRoute);

module.exports = app;

// {
// 	"title":"Max steel",
// 	"description":"Boneco max steel",
// 	"slug":"max-steel",
// 	"price":2000,
// 	"tags":["brinquedos", "infantil"]
// }