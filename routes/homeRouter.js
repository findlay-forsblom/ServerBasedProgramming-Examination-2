const controller = require('../controllers/homeController.js')

const express = require('express')
const router = express.Router()

router.get('/', controller.index)
router.get('/signup', controller.signUp)
router.route('/login')
  .get(controller.login)
  .post(controller.loginPost)
// router.route('/create')
//   .get(controller.create)
//   .post(controller.post)

module.exports = router
