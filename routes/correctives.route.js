/** =====================================================================
 *  CORRECTIVES ROUTER
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// MIDDLEWARES
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// CONTROLLER
const { getCorrectives, createCorrectives, updateCorrectives, deleteCorrectives, getCorrectiveId, postNotesCorrectives, getCorrectiveProduct } = require('../controllers/correctives.controller');



const router = Router();

/** =====================================================================
 *  GET CORRECTIVES
=========================================================================*/
router.get('/', validarJWT, getCorrectives);
/** =====================================================================
 *  GET CORRECTIVES
=========================================================================*/
/** =====================================================================
 *  GET CORRECTIVE FOR ID
=========================================================================*/
router.get('/:id', validarJWT, getCorrectiveId);
/** =====================================================================
 *  GET CORRECTIVE FOR ID
=========================================================================*/

/** =====================================================================
 *  GET CORRECTIVE FOR PRODUCT
=========================================================================*/
router.get('/product/:product', validarJWT, getCorrectiveProduct);
/** =====================================================================
 *  GET CORRECTIVE FOR PRODUCT
=========================================================================*/

/** =====================================================================
 *  CREATE CORRECTIVE
=========================================================================*/
router.post('/', [
        validarJWT,
        check('staff', 'El tecnico es olbigatorio').isMongoId(),
        check('client', 'El cliente es olbigatorio').isMongoId(),
        check('description', 'La descripcion del correctivo es obligatoria').not().isEmpty(),
        validarCampos
    ],
    createCorrectives
);
/** =====================================================================
 *  CREATE CORRECTIVE
=========================================================================*/

/** =====================================================================
 *  POST NOTES IN PREVENTIVE
=========================================================================*/
router.post('/notes/:id', [
        validarJWT,
        check('note', 'El comentario es olbigatorio').not().isEmpty(),
        validarCampos
    ],
    postNotesCorrectives
);
/** =====================================================================
*  POST NOTES IN PREVENTIVE
=========================================================================*/

/** =====================================================================
 *  UPDATE CORRECTIVES
=========================================================================*/
router.put('/:id', [
        validarJWT,
        validarCampos
    ],
    updateCorrectives
);
/** =====================================================================
 *  UPDATE CORRECTIVES
=========================================================================*/

/** =====================================================================
 *  DELETE CORRECTIVES
=========================================================================*/
router.delete('/:id', validarJWT, deleteCorrectives);
/** =====================================================================
 *  DELETE CORRECTIVES
=========================================================================*/

// EXPORTS
module.exports = router;