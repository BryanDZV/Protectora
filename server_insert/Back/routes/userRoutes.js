const express = require('express');
const {register, login, checkSession, postFav, postAdoption, getUserById} = require('../controllers/user.controller');
const {isAuth} = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/:id', getUserById)
router.post('/checksession',[isAuth], checkSession);    
router.post('/addfav', postFav);
router.post('/addAdoption', postAdoption);

module.exports = router;
