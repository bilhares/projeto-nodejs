'use strict'

const repository = require('../repositories/customer-repository')
const ValidationContract = require('../validators/fluent-validator');
const md5 = require('md5');

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
        res.status(201).send({ message: 'Cliente cadastrado com sucesso!' });
    } catch (e) {
        res.status(500).send({ message: 'Falha ao processar a requisição' });
    }
}