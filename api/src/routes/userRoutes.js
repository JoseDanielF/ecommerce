const express = require('express');
const router = new express.Router();
const userController = require('../controllers/userController');
const cors = require('cors');

router.use(cors())
router.options('*',  cors())

router.post('/api/register', userController.registerUser);
router.post('/api/login', userController.loginUser);
router.put('/api/updateUser/:id', userController.updateUser);
router.put('/api/deleteUser/:id', userController.deleteUser);
router.get('/api/consultCep/:cep', userController.consultCep);
router.get('/api/getAllProducts', userController.getAllProducts);
router.get('/api/getProductById/:id', userController.getProductByID);

module.exports = router;