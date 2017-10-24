'use strict'

const repository = require('../repositories/product-repository')
const ValidationContract = require('../validators/fluent-validator');

exports.get = async (req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({ message: 'Falha ao processar a requisição' });
    }
}
exports.getBySlug = async (req, res, next) => {
    try {
        var data = await repository.getBySlug(req.params.slug);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({ message: 'Falha ao processar a requisição' });
    }
}

exports.getById = async (req, res, next) => {
    try {
        var data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({ message: 'Falha ao processar a requisição' });
    }
}

exports.getByTag = async (req, res, next) => {
    try {
        var data = await repository.getByTag(req.params.tags);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({ message: 'Falha ao processar a requisição' });
    }
}

exports.post = async (req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.title, 3, 'O titulo deve conter mais de 3 caracteres');
    if (!contract.isValid()) {
        res.status(400).send(contract.errors).end();
        return;
    }
    try {
        await repository.create(req.body);
        res.status(201).send({ message: 'Produto cadastrado com sucesso!' });
    } catch (e) {
        res.status(500).send({ message: 'Falha ao processar a requisição' });
    }
}

exports.put = async (req, res, next) => {
    try {
        await repository.update(req.params.id, req.body);
        res.status(201).send({ message: 'Produto atualizado com sucesso!' });
    } catch (e) {
        res.status(500).send({ message: 'Falha ao processar a requisição' });
    }
};

exports.delete = async (req, res, next) => {
    try {
        await repository.delete(req.body.id);
        res.status(200).send({ message: 'Produto removido com sucesso!' });
    } catch (e) {
        res.status(500).send({ message: 'Falha ao processar a requisição' });
    }
};