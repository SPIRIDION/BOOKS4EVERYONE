const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const multer = require('multer')
const storage = require('../utils/storage')
const upload = multer({ storage })

// registriamo un nuovo utente 
router.post('/users/register', upload.single('immagineProfilo'),userController.registerUser)

// eseguiamo il login di un utente già esistente
router.post('/users/login', userController.loginUser)

// otteniamo i dati di un singolo user tramite il suo id
router.get('/users/:id', userController.getUserById)

// modifichiamo i dati di un signolo user tramite il suo id
router.put('/users/:id', userController.updateUser)

// eliminiamo uno user tramite il suo id
router.delete('/users/:id', userController.deleteUser)

module.exports = router