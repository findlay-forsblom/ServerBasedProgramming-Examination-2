const controller = require('../controllers/homeController.js')

const express = require('express')
const router = express.Router()

router.get('/', controller.index)
router.route('/login')
  .get(controller.redirectHome, controller.login)
  .post(controller.redirectHome, controller.loginPost)
router.route('/signup')
  .get(controller.redirectHome, controller.signUp)
  .post(controller.redirectHome, controller.signUpPost)
// router.route('/create')
//   .get(controller.create)
//   .post(controller.post)

module.exports = router
