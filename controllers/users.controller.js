const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/users.model');

/** ======================================================================
 *  GET USERS
=========================================================================*/
const getUsers = async(req, res) => {

    try {

        const [users, total] = await Promise.all([
            User.find({}, 'usuario name role address img valid status fecha'),
            User.countDocuments()
        ]);

        res.json({
            ok: true,
            users,
            total
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });

    }


};
/** =====================================================================
 *  GET USERS
=========================================================================*/

/** =====================================================================
 *  GET USERS ID
=========================================================================*/
const getUserId = async(req, res = response) => {

    try {
        const id = req.params.id;

        const userDB = await User.findById(id);
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No hemos encontrado este usuario, porfavor intente nuevamente.'
            });
        }

        res.json({
            ok: true,
            user: userDB
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};
/** =====================================================================
 *  GET USERS ID
=========================================================================*/


// EXPORTS
module.exports = {
    getUsers,
    getUserId
};