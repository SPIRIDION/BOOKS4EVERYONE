const offer = require('../models/Offerta')
const cloudinary = require('../utils/cloudinary')

// logica per le operazioni di CRUD inerenti alle offerte

// creare una nuova offerta
exports.createOffer = async (req, res) => {
  try {const { titolo, descrizione, prezzo15, prezzo30, prezzoVendita } = req.body
    const userId = req.user.id// preso dal middleware JWT
    const immagineLibro = req.file?.path || ''

    const newOffer = await offer.create({
      titolo,
      descrizione,
      prezzo15,
      prezzo30,
      prezzoVendita,
      immagineLibro,
      user: userId
    })

    res.status(201).json(newOffer)
  } catch(err) {
    res.status(500).json({message: `Errore nella creazione dell\'offerta: ${err}`})
  }
}

// ottenere tutte le offerte
exports.getAllOffers = async (req, res) => {
  try {
    const offerte = await offer.find().populate('user','username immagineProfilo')
    res.status(200).json(offerte)
  } catch(err) {
    res.status(500).json({message: `Errore nel recupero delle offerte: ${err}`})
  }
}

// ottenere una sola offerta tramite id
exports.getOneOffer = async (req, res) => {
  try {
    const offerta = await offer.findById(req.params.id).populate('user', 'username immagineProfilo')
    if (!offerta) return res.status(404).json({message: 'Offerta non trovata!'})

    res.status(200).json(offerta)
  } catch(err) {
    res.status(500).json({message: `Errore nel recupero dell\'offerta: ${err}`})
  }
}

// modifica di un'offerta 
exports.updateOffer = async (req, res) => {
  try {
    const offerta = await offer.findById(req.params.id)
    if (!offerta) return res.status(404).json({message: 'Offerta non trovata!'})
    
    if (offerta.user.toString() !== req.user.id)
      return res.sttus(403).json({message: 'Non autorizzato!'})

    const updateData = {
      titolo: req.body.titolo || offerta.titolo,
      descrizione: req.body.descrizione || offerta.descrizione,
      prezzo15: req.body.prezzo15 || offerta.prezzo15,
      prezzo30: req.body.prezzo30 || offerta.prezzo30,
      prezzoVendita: req.body.prezzoVendita || offerta.prezzoVendita
    }

    if (req.file) {
      updateData.immagineLibro = req.file.path
    }

    const offerUpdated = await offer.findByIdAndUpdate(req.params.id, updateData, { new: true})
    res.status(200).json({offerUpdated})
  } catch(err) {
    res.status(500).json({message: 'Errore nella modifica dell\'offerta'})
  }
}

// eliminazione di un'offerta
exports.deleteOffer = async (req, res) => {
  try {
    const offerta = await offer.findById(req.params.id)
    if (!offerta) return res.status(404).json({message: 'Offerta non trovata!'})
    
    if (offerta.user.toString() !== req.user.id)
      return res.status(403).json({message: 'Non autorizzato!'})

    await offer.findByIdAndDelete(req.params.id)
    res.status(200).json({message: 'Offerta eliminata'})
  } catch(err) {
    res.status(500).json({message: `Errore nella cancellazione: ${err}`})
  }
}

// ottenere tutte le offerte di un user autenticato
exports.getOffersByUser = async (req, res) => {
  try {
    const userId = req.user.id // preso dal JWT
    const offerte = await offer.find({ user: userId }).populate('user', 'username immagineProfilo')
    res.status(200).json(offerte)
  } catch(err) {
    res.status(500).json({ message: `Errore nel recupero offerte dell'utente: ${err}` })
  }
}