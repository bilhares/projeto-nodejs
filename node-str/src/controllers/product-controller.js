'use strict'

const repository = require('../repositories/product-repository')
const ValidationContract = require('../validators/fluent-validator');
const azure = require('azure-storage');
const guid = require('guid');
var config = require('../config');

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
        //cria o blobl service 
        const blobSvc = azure.createBlobService(config.containerConnectionString);

        let filename = guid.raw().toString + '.jpg';
        let rawdata = req.body.image;
        let matches = rawdata.match(/^data:([A-za-z-+\/]+);base64,(.+)$/);
        let type = matches[1];
        let buffer = new Buffer(matches[2], 'base64');

        await blobSvc.createAppendBlobFromText('product-images', filename, buffer, {
            contentType: type
        },
            function (error, result, response) {
                if (error) {
                    filename = 'default-product.png'
                }
            });

        await repository.create(
            {
                title: req.body.title,
                slug: req.body.slug,
                description: req.body.description,
                price: req.body.price,
                active: true,
                tags: req.body.tags,
                image: 'https://nodestr.blob.core.windows.net/product-images/' + filename
            }
        );
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