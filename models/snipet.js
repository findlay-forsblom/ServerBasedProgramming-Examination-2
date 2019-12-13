'use strict'
const mongoose = require('mongoose')

const snipetSchema = mongoose.Schema({
  content: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  tag: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
  created: { type: Date, required: true },
  lastUpdated: { type: Date }
})

snipetSchema.pre('remove', function (next) {
  const snipet = this
  mongoose.model('User').updateOne(
    { _id: snipet.user },
    { $pull: { snipets: snipet.id } },
    { multi: true },
    next
  )
})

snipetSchema.pre('remove', function (next) {
  const snipet = this
  mongoose.model('Tag').updateMany(
    { _id: { $in: snipet.tag } },
    { $pull: { snipet: snipet.id } },
    { multi: true },
    next
  )
})

// snipetSchema.pre('updateOne', async function (next) {
//   const snipet = this
//   console.log('the tag is', snipet.id)
//   mongoose.model('Tag').updateMany(
//     { _id: { $in: snipet.tag } },
//     { $pull: { snipet: snipet.id } },
//     { multi: true },
//     next
//   )
// })

const Schema = mongoose.model('Snipet', snipetSchema)
module.exports = Schema
