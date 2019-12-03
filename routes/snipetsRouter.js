const controller = require('../controllers/snipetsController.js')
const express = require('express')
const router = express.Router()

router.get('/', controller.index)
router.get('/user/:id', controller.checkSameUser, controller.usersPost)
router.route('/edit/:id')
  .get(controller.checkRights, controller.userEdit)
  .post(controller.checkRights, controller.userEdit)
router.post('/delete/:id', controller.checkSameUser, controller.userEdit)
router.route('/create')
  .get(controller.authorization, controller.create)
  .post(controller.authorization, controller.createPost)

module.exports = router
