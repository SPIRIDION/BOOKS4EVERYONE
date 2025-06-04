const mongoose = require('mongoose')

const offerSchema = new mongoose.Schema({
  titolo: {type: String, required: true},
  descrizione: {type: String, required: true},
  prezzo15: {type: String, required: true},
  prezzo30: {type: String, required: true},
  prezzoVendita: {type: String, required: true},
  immagineLibro: {type: String, required: true},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'user',required: true},
}, {timestamps: true})

module.exports = mongoose.model('offer', offerSchema)