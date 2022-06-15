const express = require('express');
const router = express.Router();

// middlewares
const auth = require('./middlewares/auth');
const uploadFile = require("./middlewares/upload");

// permissions
const UserPermissions = require('./permissions/user.permissions');

// controllers
const AuthController = require('./controllers/AuthController');
const ImageController = require('./controllers/ImageController');
const UserController = require('./controllers/UserController');

// home
router.get('/', (req, res) => res.json({ message: "API is Ready" }));

// login and register
router.post('/api/login', AuthController.login);
router.post('/api/register', AuthController.register);

// routes images
router.post('/api/images', uploadFile, ImageController.upload);

// routes user routes
router.get('/api/users', auth, UserController.index);
router.post('/api/users', auth, UserPermissions.create, UserController.create);
router.get('/api/users/:id', auth, UserController.find, UserController.show);
router.patch('/api/users/:id', auth, UserPermissions.update, UserController.find, UserController.update);
router.delete('/api/users/:id', auth, UserPermissions.delete, UserController.find, UserController.delete);

module.exports = router;
