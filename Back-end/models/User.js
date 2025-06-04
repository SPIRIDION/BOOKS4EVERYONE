const mongoose = require('mongoose')

// creiamo il modello della collection user
const userSchema = new mongoose.Schema({
  nome: {type: String, required: true},
  cognome: {type: String, required: true},
  username: {type: String, required: true, unique: true},//parametro unico per ogni utente
  email: {type: String, required: true, unique: true},// parametro unico per ogni utente
  residenza: {type: String, required: true},
  password: {type: String, required: true},
  immagineProfilo: {type: String}
}, {timestamps: true})// per aggiungere la data di creazione del documento e data dell'ultimo aggiornamento

module.exports = mongoose.model('user', userSchema)