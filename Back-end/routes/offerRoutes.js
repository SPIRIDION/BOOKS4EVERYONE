const express = require('express')
const router = express.Router()
const offerController = require('../controllers/offertaController')
const { protect } = require('../middleware/authMiddleware')
const upload = require('../middleware/multer')

// otteniamo tutte le offerte
router.get('/', offerController.getAllOffers)

// otteniamo tutte le offerte di un singolo user
router.get('/mine', protect, getOffersByUser)

// otteniamo una singola offerta tramite il suo id
router.get('/:id', offerController.getOneOffer)

// creiamo una nuova offerta
router.post('/', protect, upload.single('immagineLibro'), offerController.createOffer)

// modifichiamo un'offerta
router.put('/:id', protect, upload.single('immagineLibro'), offerController.updateOffer)

// eliminiamo un'offerta
router.delete('/:id', protect, offerController.deleteOffer)

module.exports = router