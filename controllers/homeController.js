const homeController = {}

homeController.index = (req, res, next) => {
  res.render('home/home')
}

homeController.signUp = (req, res, next) => {
  res.render('home/signUp')
}

homeController.login = (req, res, next) => {
  res.render('home/login')
}

homeController.loginPost = (req, res, next) => {
  res.render('home/login')
}

module.exports = homeController
