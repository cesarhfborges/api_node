import jwt, {verify} from "jsonwebtoken";

function verifyJWT(req, res, next) {
    const authorization = req.headers['authorization'];
    if (!authorization) {
        return res.status(401).json({ auth: false, message: 'No token provided.' })
    }
    const token = authorization.replace('Bearer ', '');

    verify(token, process.env.SECRET,function(err, decoded) {
        if (err) {
            return res.status(401).json({ auth: false, message: 'Failed to authenticate token.' });
        }
        req.userId = decoded.id;
        next();
    });
}

export {verifyJWT};
