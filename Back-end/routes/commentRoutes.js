const express = require('express')
const router = express.Router()
const commentController = require('../controllers/commentoController')
const { protect } = require('../middleware/authMiddleware')

// aggiungiamo un commento
router.post('/:offerId', protect, commentController.addComment)

// otteniamo tutti i commenti di una specifica offerta
router.get('/:offerId', commentController.getAllCommentsPerOffer)

module.exports = router