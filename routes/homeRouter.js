const controller = require('../controllers/homeController.js')

const express = require('express')
const router = express.Router()

router.get('/', controller.index)
router.route('/login')
  .get(controller.login)
  .post(controller.loginPost)
router.route('/signup')
  .get(controller.signUp)
  .post(controller.signUpPost)
// router.route('/create')
//   .get(controller.create)
//   .post(controller.post)

module.exports = router
