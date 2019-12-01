const mongoose = require('mongoose')

const tagSchema = mongoose.Schema({
  content: { type: String, required: true },
  snipet: [{ type: mongoose.Types.ObjectId, ref: 'Snipet' }]
})

const Schema = mongoose.model('Tag', tagSchema)

module.exports = Schema
