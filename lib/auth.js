const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const secretKey = 'SuperSecret';

function generateAuthToken(userID) {
    const payload = { sub: userID };
    return jwt.sign(payload, secretKey, {expiresIn: '24h' });
}
exports.generateAuthToken = generateAuthToken;

function requireAuthentication(req, res, next) {
    const authHeader = req.get('Authorization') || '';
    const authHeaderParts = authHeader.split(' ');
    const token = authHeaderParts[0] === 'Bearer' ? authHeaderParts[1] : null;
    try {
        const payload = jwt.verify(token, secretKey);
        req.user = payload.sub;
        next();
    } catch (err) {
        res.status(401).json({
            error: "Invalid authentication token provided."
        });
    }
}
exports.requireAuthentication = requireAuthentication;

async function hashAndSaltPassword(password) {
    return await bcrypt.hash(password, 8)
}
exports.hashAndSaltPassword = hashAndSaltPassword;

async function validateUser(user, password) {
    return !!user && await bcrypt.compare(password, user.password);
}
exports.validateUser = validateUser;
