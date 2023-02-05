import ClientRepository from "../models/clients.model.js";

async function findAll(req, res) {
    const result = await ClientRepository.findAll();
    return res.status(200).json(result);
}

async function findClient(req, res) {
    const result = await ClientRepository.findByPk(req.params.id);
    return res.status(200).json(result);
}

async function addClient(req, res) {
    const result = await ClientRepository.create({
        nome: req.body.nome,
        email: req.body.email,
    });
    return res.status(200).json(result);
}

async function updateClient(req, res) {
    const up = await ClientRepository.update(
        {
            nome: req.body.nome,
            email: req.body.email,
        },
        {
            where: {
                id: req.params.id,
            },
        }
    );

    const result = await ClientRepository.findByPk(req.params.id);
    return res.status(200).json(result);
}

async function deleteClient(req, res) {
    await ClientRepository.destroy({
        where: {
            id: req.params.id,
        },
    });
    return res.status(200).json({status: 200, message: 'Sucesso.'});
}

export default { findAll, addClient, findClient, updateClient, deleteClient };
