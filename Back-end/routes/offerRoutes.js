const express = require('express')
const router = express.Router()
const offerController = require('../controllers/offertaController')
const { protect } = require('../middleware/authMiddleware')
const upload = require('../middleware/multer')

// otteniamo tutte le offerte
router.get('/offers', offerController.getAllOffers)

// otteniamo una singola offerta tramite il suo id
router.get('/offers/:id', offerController.getOneOffer)

// creiamo una nuova offerta
router.post('/offers', protect, upload.single('immagineLibro'), offerController.createOffer)

// modifichiamo un'offerta
router.put('/offers/:id', protect, upload.single('immagineLibro'), offerController.updateOffer)

// eliminiamo un'offerta
router.delete('/offers/:id', protect, offerController.deleteOffer)

module.exports = router