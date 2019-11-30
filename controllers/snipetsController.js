const snipetsController = {}

snipetsController.index = (req, res, next) => {
  res.render('snipets/index')
}

snipetsController.create = (req, res, next) => {
  res.render('snipets/create')
}

snipetsController.createPost = (req, res, next) => {
  
}

snipetsController.edit = (req, res, next) => {
  res.render('snipets/edit')
}

snipetsController.delete = (req, res, next) => {
  res.render('snipets/delete')
}

module.exports = snipetsController
