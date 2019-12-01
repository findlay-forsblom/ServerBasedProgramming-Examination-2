const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  snipets: [{ type: mongoose.Types.ObjectId, ref: 'Snipet' }]
})

const Schema = mongoose.model('User', userSchema)
module.exports = Schema
