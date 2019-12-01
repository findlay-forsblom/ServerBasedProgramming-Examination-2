const homeController = {}
const bcrypt = require('bcryptjs')
const passwordChecker = require('../libs/passwordHelper.js')

homeController.index = (req, res, next) => {
  res.render('home/home')
}

homeController.signUp = (req, res, next) => {
  res.render('home/signUp')
}

homeController.signUpPost = async (req, res, next) => {
  res.render('home/signUp')
  const hashed = '$2a$10$KDnQ2y2olkQE0/b5NClev.kxqDDr9qgdw7d.EOrdzG67CQpDxPqxy'
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword

  const match = passwordChecker.checkSamePassword(password, confirmPassword)
  const length = passwordChecker.checklength(password)
  if (match && length) {
    
  } else if (!match && !length) {
    console.log('no match')
  } else if (!match) {
    console.log('no match')
  } else if (!length) {
    console.log('no match')
  }

  // const salt = await bcrypt.genSalt(10)
  // console.log('salt is ', salt)
  // const hash = await bcrypt.hash(password, salt)
  // console.log('hash is', hash)
  // const match = await bcrypt.compare(password, hashed)
  // if (password === confirmPassword) {
  //   console.log('same passwod')
  // } else {
  //   console.log('not same password')
  // }
}

homeController.login = (req, res, next) => {
  res.render('home/login')
}

homeController.loginPost = (req, res, next) => {
  res.render('home/login')
}

module.exports = homeController
