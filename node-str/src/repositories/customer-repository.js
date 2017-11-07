'use strict'
const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');

exports.create = async (data) => {
    var customer = new Customer(data);
    await customer.save();
}

exports.authenticate = async(data) => {
    console.log('aqui 2 '+ data.email+' - '+ data.password);
    const res = await Customer.findOne({
        email: data.email,
        password: data.password
    });
    console.log(res.email);
    return res;
}