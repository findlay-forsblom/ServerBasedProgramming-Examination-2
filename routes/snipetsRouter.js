const controller = require('../controllers/snipetsController.js')
const express = require('express')
const router = express.Router()
const csrf = require('csurf')

const csrfProtection = csrf({ cookie: true })

router.get('/', controller.index)
router.get('/user/:id', controller.checkSameUser, csrfProtection, controller.usersPost)
router.get('/tags', controller.tags)
router.get('/tags/:id', controller.getTags)
router.route('/edit/:id')
  .get(controller.checkRights, csrfProtection, controller.userEdit)
  .post(controller.checkRights, csrfProtection, controller.editPost)
router.post('/delete/:id', controller.checkRights, csrfProtection, controller.userDeletePost)
router.route('/create')
  .get(controller.authorization, controller.create)
  .post(controller.authorization, controller.createPost)

module.exports = router
