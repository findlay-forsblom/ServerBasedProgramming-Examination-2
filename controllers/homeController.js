const homeController = {}
const passwordChecker = require('../libs/passwordHelper.js')
const User = require('../models/user.js')

homeController.index = (req, res, next) => {
  res.render('home/home')
}

homeController.signUp = (req, res, next) => {
  res.render('home/signUp')
}

homeController.signUpPost = async (req, res, next) => {
  let username = req.body.username
  let email = req.body.email
  username = username.trim()
  email = email.trim()
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword

  const match = passwordChecker.checkSamePassword(password, confirmPassword)
  if (match) {
    try {
      const user = new User({
        username: username,
        email: email,
        password: password
      })
      await user.save()
      req.session.flash = { type: 'success', text: 'User succesfully created' }
      res.redirect('./')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('/signup')
    }
  } else {
    req.session.flash = { type: 'danger', text: 'passwords do not match' }
    res.redirect('/signup')
  }
}

homeController.login = (req, res, next) => {
  res.render('home/login')
}

homeController.loginPost = async (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  try {
    const user = await User.findOne({ username })
    if (!user) {
      req.session.flash = { type: 'danger', text: 'Log in failed. username or password is incorrect' }
      res.redirect('/login')
      return
    }
    const result = await user.comparePassword(password)
    if (result) {
      req.session.flash = { type: 'success', text: 'Succesfully logged in' }
      res.redirect('./')
    } else {
      req.session.flash = { type: 'danger', text: 'Log in failed. username or password is incorrect' }
      res.redirect('/login')
    }
  } catch (error) {
    console.log(error.message)
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('/login')
  }
}

module.exports = homeController
