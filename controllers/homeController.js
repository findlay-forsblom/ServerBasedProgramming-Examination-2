const homeController = {}
const passwordChecker = require('../libs/passwordHelper.js')
const User = require('../models/user.js')
const SESSION_NAME = require('../app.js')

homeController.index = (req, res, next) => {
  res.render('home/home')
}

homeController.signUp = (req, res, next) => {
  res.render('home/signUp')
}

homeController.redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/login')
  } else {
    next()
  }
}

// for login and signup
homeController.redirectHome = (req, res, next) => {
  if (req.session.userId) {
    res.redirect('/')
  } else {
    next()
  }
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
      req.session.userId = user.id
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
      req.session.flash = { type: 'success', text: `Welcome ${user.username}. You have succesfully logged in` }
      req.session.userId = user.id
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

homeController.logoutPost = async (req, res, next) => {
  delete req.session.userId
  req.session.flash = { type: 'success', text: 'Succesfully logged out' }
  res.clearCookie(SESSION_NAME, { path: '../app.js' })
  res.redirect('./')
  // req.session.destroy(err => {
  //   if (err) {
  //     req.session.flash = { type: 'danger', text: 'some error ocurred while logging out pls try again' }
  //     return res.redirect('./')
  //   }
  //   res.clearCookie(SESSION_NAME, { path: '../app.js' })
  //   // req.session.flash = { type: 'success', text: 'Succesfully logged out' }
  //   res.redirect('./')
  // })
}

module.exports = homeController
