import UsersRepository from "../models/users.model.js";
import jwt, {verify} from "jsonwebtoken";
import {email} from "../mail/email.js";

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
            await user.update({refresh: refresh});

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
        await UsersRepository.create(params);
        return res.status(200).json({status: 200, message: 'Usuário cadastrado com sucesso.'});
    } catch (e) {
        console.log('error: ', e);
        console.log('error: ', e.errors);
        res.status(406).json(e.errors.map(i => ({key: i.path, message: i.message})));
    }
}

async function refresh(req, res) {
    try {
        const sessionTime = parseInt(process.env.SESSION_TIME) ?? 300;

        const params = {
            refresh: req.body.refresh,
        };
        const user = await UsersRepository.findOne({ where: params });
        const payload = { id: user.id, email: user.email, time: new Date() };

        verify(user.refresh, process.env.REFRESH_SECRET.toString(),function(err, decoded) {
            if (err) {
                return res.status(401).json({ auth: false, message: 'Failed to refresh token.' });
            }
            const token = jwt.sign(payload, process.env.SECRET.toString(), {expiresIn: sessionTime});
            return res.status(200).json({token: token});
        });
    } catch (e) {
        return res.status(401).json({ auth: false, message: 'Failed to refresh token.' });
    }
}

async function sendConfirmationEmail(req, res) {
    try {
        await email({
            from: 'dortha.farrell@ethereal.email',
            to: 'cesar_silk321@hotmail.com',
            subject: 'Confirmação de cadastro'
        });
        return res.status(200).json({ status: 200, message: 'Success, check your\'s email' });
    } catch (e) {
        return res.status(500).json({ status: 500, message: 'error' });
    }
}

async function confirmEmail(req, res) {
    if (req.params.confirmation) {
        return res.status(200).json({ status: 200, message: 'Success, email confirmed.' });
    }
    return res.status(500).json({ status: 500, message: 'error' });
}

export default { login, register, refresh, sendConfirmationEmail, confirmEmail };
