const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  titolo: {type: String, required: true},
  testo: {type: String, required: true},
  rate: {type: Number, required: true, min: 1, max: 5},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
  offerta: {type: mongoose.Schema.Types.ObjectId,ref: 'offer', required: true},
}, {timestamps: true})

module.exports = mongoose.model('comment', commentSchema)