/** =====================================================================
 *  USER ROUTER 
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// MIDDLEWARES
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// CONTROLLERS
const { getUsers, getUserId } = require('../controllers/users.controller');

const router = Router();

/** =====================================================================
 *  GET USERS
=========================================================================*/
router.get('/', validarJWT, getUsers);
/** =====================================================================
 *  GET USERS
=========================================================================*/
/** =====================================================================
 *  GET USERS ID
=========================================================================*/
router.get('/user/:id', validarJWT, getUserId);
/** =====================================================================
 *  GET USERS ID
=========================================================================*/



// EXPORT
module.exports = router;