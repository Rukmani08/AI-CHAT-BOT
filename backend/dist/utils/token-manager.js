import jwt from 'jsonwebtoken';
import { COOKIE_NAME } from './constants.js';
export const createToken = (id, email, expiresIn) => {
    const payload = { id, email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn,
    });
    return token;
};
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.signedCookies[`${COOKIE_NAME}`];
        if (!token || token.trim() === '') {
            return res.status(401).json({ message: 'Token Not Received' });
        }
        return jwt.verify(token, process.env.JWT_SECRET, (err, success) => {
            if (err) {
                return res.status(401).json({ message: 'Token Expired' });
            }
            else {
                res.locals.jwtData = success;
                return next();
            }
        });
    }
    catch (error) {
        return res.status(401).json({ message: 'Error Verifying Token' });
    }
};
//# sourceMappingURL=token-manager.js.map