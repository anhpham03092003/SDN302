// const JWT = require('jsonwebtoken');
// const createError = require('http-errors');
// const bcrypt = require('bcrypt');

// async function verifyAccessToken(req, res, next) {
//     if (!req.headers['authorization']) {
//         return next(createError.Unauthorized)
//     }
//     const authHeader = req.headers['authorization']
//     const bearerToken = authHeader.split(' ')
//     const token = bearerToken[1];

//     JWT.verify(token, process.env.JWT_SECRET, (err, payload) => {
//         if (err) {
//             const message = err.name == 'JsonWebTokenError' ? 'Unauthorized' : err.message;
//             return next(createError.Unauthorized(message))
//         }
//         req.payload = payload;
//         next();
//     })
// }

// module.exports = {
//     verifyAccessToken
// }

const JWT = require('jsonwebtoken');
const createError = require('http-errors');

async function verifyAccessToken(req, res, next) {
    if (!req.headers['authorization']) {
        console.error("Authorization header missing");
        return next(createError(401, 'Authorization header missing'));
    }

    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');
    
    if (bearerToken.length !== 2 || bearerToken[0] !== 'Bearer') {
        console.error("Invalid Authorization header format");
        return next(createError(401, 'Invalid Authorization header format'));
    }

    const token = bearerToken[1];
    JWT.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
            console.error("Token verification failed:", message);
            return next(createError(401, message));
        }
        req.payload = payload;
        next();
    });
}

module.exports = {
    verifyAccessToken
};
