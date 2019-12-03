const mongoose = require('mongoose')

const snipetSchema = mongoose.Schema({
  content: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, ref: 'User' }
})

snipetSchema.pre('remove', function (callback) {
  // Remove all the docs that refers
  this.model('User').remove({ _Id: this._id }, callback)
})

const Schema = mongoose.model('Snipet', snipetSchema)
module.exports = Schema
