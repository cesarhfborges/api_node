import UsersRepository from "../models/users.model.js";
import jwt from "jsonwebtoken";

async function login(req, res) {
    try {
        const params = {
            email: req.body.email,
        };
        const result = await UsersRepository.scope('withPassword').findOne({ where: params });
        const valid = await result.validPassword(req.body.password, result.password);

        if (valid) {
            const sessionTime = parseInt(process.env.SESSION_TIME) ?? 300;
            const refreshTime = sessionTime * 3;

            const payload = { id: result.id, email: result.email, time: new Date() };

            const token = jwt.sign(payload, process.env.SECRET.toString(), {expiresIn: sessionTime});
            const refresh = jwt.sign(payload, process.env.REFRESH_SECRET.toString(), {expiresIn: refreshTime});

            const user = await UsersRepository.findOne({ where: params });
            user.update({refresh: refresh});

            return res.status(200).json({token: token, refresh: refresh});
        }
        return res.status(401).json({message: 'Verifique as credenciais e tente novamente.'});
    } catch (e) {
        console.log('error: ', e);
        console.log('error: ', e.errors);
        return res.status(406).json(e.errors.map(i => ({key: i.path, message: i.message})));
    }
}

async function register(req, res) {
    try {
        const params = {
            email: req.body.email,
            password: req.body.password
        };
        const result = await UsersRepository.create(params);
        // res.statusCode = 200;
        return res.status(200).json(result);
    } catch (e) {
        console.log('error: ', e);
        console.log('error: ', e.errors);
        // res.statusCode = 406;
        res.status(406).json(e.errors.map(i => ({key: i.path, message: i.message})));
    }
}

// TODO: Remover depois de implementar  * apenas teste
async function list(req, res) {
    const result = await UsersRepository.findAll();
    res.status(200).json(result);
}

export default { login, register, list };
