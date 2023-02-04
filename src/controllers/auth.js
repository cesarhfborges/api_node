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
    try {
        const params = {
            email: req.body.email,
            password: req.body.password
        };
        const result = await UsersRepository.create(params);
        res.statusCode = 200;
        res.json(result);
    } catch (e) {
        console.log('error: ', e);
        console.log('error: ', e.errors);
        res.statusCode = 406;
        res.json(e.errors.map(i => ({key: i.path, message: i.message})));
    }
}

// TODO: Remover depois de implementar  * apenas teste
async function list(req, res) {
    const result = await UsersRepository.findAll();
    res.json(result);
}

export default { login, register, list };
