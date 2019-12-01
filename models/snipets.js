const mongoose = require('mongoose')

const snipetSchema = mongoose.Schema({
  content: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, ref: 'User' }
})

const Schema = mongoose.model('Snipet', snipetSchema)
module.exports = Schema
