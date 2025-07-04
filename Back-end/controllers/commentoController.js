const Comment = require('../models/Commento')
const offer = require('../models/Offerta')

// logica per le operazioni di CRUD inerenti ai commenti 

// aggiunta di un nuovo commento ad un'offerta
exports.addComment = async (req, res) => {
  try {
    const { titolo, testo, rate } = req.body
    const userId = req.user.id
    const offerId = req.params.offerId

    const newComment = await Comment.create({
      titolo,
      testo,
      rate,
      user: userId,
      offer: offerId
    })

    res.status(201).json(newComment)
  } catch(err) {
    res.status(500).json({message: `Errore nella creazione del commento: ${err}`})
  }
}

// recupera di tutti i commenti di una singola offerta
exports.getAllCommentsPerOffer = async (req, res) => {
  try {
    const offerId = req.params.offerId
    console.log('ID ricevuto nella get: ' + offerId)

    const comments = await Comment.find({ offer: offerId }).populate('user', 'username immagineProfilo')
    res.status(200).json(comments)
  } catch(err) {
    res.status(500).json({message: `Errore nel recupero dei commenti: ${err}`})
  }
}