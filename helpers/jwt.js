/**
 * JWT
 */

const jwt = require('jsonwebtoken');


const generarJWT = (aid) => {

    return new Promise((resolve, reject) => {

        const payload = {
            aid
        };

        jwt.sign(payload, process.env.SECRET_SEED_JWT, {
            expiresIn: '12h'
        }, (err, token) => {

            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }

        });
    });

};

module.exports = {
    generarJWT
};