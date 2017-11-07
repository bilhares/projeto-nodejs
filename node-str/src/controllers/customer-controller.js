'use strict'

const repository = require('../repositories/customer-repository')
const ValidationContract = require('../validators/fluent-validator');
const md5 = require('md5');
const emailService = require('../services/email-service');
const authService = require('../services/auth-service');

exports.post = async (req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.name, 3, 'O nome deve conter mais de 3 caracteres');
    contract.isEmail(req.body.email, 'Email invalido');
    if (!contract.isValid()) {
        res.status(400).send(contract.errors).end();
        return;
    }
    try {
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });
        //envio email
        emailService.send(req.body.email, 'Bem vindo ao Node store', global.EMAIL_TMPL.replace('{0}', req.body.name));
        //retorno status
        res.status(201).send({ message: 'Cliente cadastrado com sucesso!' });
    } catch (e) {
        res.status(500).send({ message: 'Falha ao processar a requisição' });
    }
};


exports.authenticate = async (req, res, next) => {
    console.log('Aqui 1')
    try {
        const customer = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });
        console.log(customer.name);
        if (!customer) {
            res.status(404).send(
                {
                    message: 'Usuario ou senha invalidos.'
                });
            return;
        }
        const token = await authService.generateToken(
            {
                id: customer._id,
                email: customer.email,
                name: customer.name
            });
        res.status(201).send(
            {
                token: token,
                data: {
                    email: customer.email, name: customer.name
                }
            });

    } catch (e) {
        res.status(500).send({ message: 'Falha ao processar a autenticação' });
    }
};

exports.refreshToken = async (req, res, next) => {
    console.log('Aqui 1')
    try {
        const customer = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });
        console.log(customer.name);
        if (!customer) {
            res.status(404).send(
                {
                    message: 'Usuario ou senha invalidos.'
                });
            return;
        }
        const token = await authService.generateToken(
            {
                id: customer._id,
                email: customer.email,
                name: customer.name
            });
        res.status(201).send(
            {
                token: token,
                data: {
                    email: customer.email, name: customer.name
                }
            });

    } catch (e) {
        res.status(500).send({ message: 'Falha ao processar a autenticação' });
    }
};