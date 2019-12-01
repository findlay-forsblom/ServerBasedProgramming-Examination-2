const Snipet = require('../models/snipet.js')

const snipetsController = {}

snipetsController.index = (req, res, next) => {
  res.render('snipets/index')
}

snipetsController.create = (req, res, next) => {
  res.render('snipets/create')
}

snipetsController.createPost = async (req, res, next) => {
  const content = req.body.text
  try {
    const snipet = new Snipet({
      content
    })
    await snipet.save()
  } catch (error) {
    
  }
  res.render('snipets/create')
}

snipetsController.edit = (req, res, next) => {
  res.render('snipets/edit')
}

snipetsController.delete = (req, res, next) => {
  res.render('snipets/delete')
}

module.exports = snipetsController
