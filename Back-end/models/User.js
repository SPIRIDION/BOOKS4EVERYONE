const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
  nome: {type: String, required: true},
  cognome: {type: String, required: true},
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  residenza: {type: String, required: true},
  password: {type: String, required: true},
  immagineProfilo: {type: String}
}, {timestamps: true})

module.exports = mongoose.model('user', userSchema)