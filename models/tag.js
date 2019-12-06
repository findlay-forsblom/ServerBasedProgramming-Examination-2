const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const tagSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true, minlength: 3 },
  snipet: [{ type: mongoose.Types.ObjectId, ref: 'Snipet' }]
})

tagSchema.plugin(uniqueValidator, { message: 'matched' })

const Schema = mongoose.model('Tag', tagSchema)

module.exports = Schema
