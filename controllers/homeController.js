const homeController = {}
const bcrypt = require('bcryptjs')
const passwordChecker = require('../libs/passwordHelper.js')
const User = require('../models/user.js')

homeController.index = (req, res, next) => {
  res.render('home/home')
}

homeController.signUp = (req, res, next) => {
  res.render('home/signUp')
}

homeController.signUpPost = async (req, res, next) => {
  res.render('home/signUp')
  // const hashed = '$2a$10$KDnQ2y2olkQE0/b5NClev.kxqDDr9qgdw7d.EOrdzG67CQpDxPqxy'
  let username = req.body.username
  let email = req.body.email
  username = username.trim()
  email = email.trim()
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword

  const match = passwordChecker.checkSamePassword(password, confirmPassword)
  // const length = passwordChecker.checklength(password)
  if (match) {
    try {
      const user = new User({
        username: username,
        email: email,
        password: password
      })
      console.log(user)
      await user.save()
      req.session.flash = { type: 'success', text: 'User succesfully created' }
      res.redirect('./')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('/signup')
    }
  } else {
    console.log('no match')
    req.session.flash = { type: 'danger', text: 'passwords do not match' }
    res.redirect('/signup')
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

homeController.loginPost = async (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const user = await User.findOne({ email: email })
  if (!user) {

  }
  const result = await user.comparePassword(password)
  if (result) {

  } else {

  }
}

module.exports = homeController
