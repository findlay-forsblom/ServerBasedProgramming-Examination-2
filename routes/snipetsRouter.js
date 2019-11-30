const controller = require('../controllers/snipetsController.js')
const express = require('express')
const router = express.Router()

router.get('/', controller.index)
router.route('/create')
  .get(controller.create)
  .post(controller.createPost)

module.exports = router
