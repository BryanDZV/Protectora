const express = require('express');
const {
      getForm,
    getFormById,
    postForm,
    putForm,
    deleteForm,
} = require('../controllers/forms.controller');

//---------------------------------INPUT---------------------------------
const router = express.Router();



//metodos GET
router.get('/', getForm);
router.get('/:id', getFormById);

//metodos POST
router.post('/register', postForm);
router.post('/insertMany', postForm);

//metodos PUT
router.put('/:id', putForm);

//metodos DELETE
router.delete('/:id', deleteForm);


//---------------------------------OUTPUT---------------------------------
module.exports = router;