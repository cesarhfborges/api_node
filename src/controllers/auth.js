import UsersRepository from "../models/users.model.js";
import bcrypt from 'bcrypt';

function login(req, res) {
    const params = {
        email: req.params.email,
        password: bcrypt.hash(req.params.password)
    };
    UsersRepository.findOne(params).then((result) => res.json(result))
}

async function register(req, res) {
    const params = {
        email: req.body.email,
        password: req.body.password
    };
    const result = await UsersRepository.create(params);
    res.json(result);
}

// TODO: Remover depois de implementar  * apenas teste
async function list(req, res) {
    const result = await UsersRepository.findAll();
    res.json(result);
}

export default { login, register, list };
