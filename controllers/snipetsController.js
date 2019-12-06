const Snipet = require('../models/snipet.js')
const User = require('../models/user.js')
const Tag = require('../models/tag.js')

const snipetsController = {}

snipetsController.index = async (req, res, next) => {
  const snipets = await Snipet.find()
  res.render('snipets/index', { snipets })
}

snipetsController.create = (req, res, next) => {
  res.render('snipets/create')
}

snipetsController.authorization = (req, res, next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    req.session.flash = { type: 'danger', text: 'You have to log in first to create post, Or register an account if new' }
    res.redirect('/login')
  }
}

snipetsController.checkSameUser = (req, res, next) => {
  const id = req.params.id
  if (id === req.session.userId && res.locals.loggedIn) {
    next()
  } else {
    res.status(403).send('unauthorised')
  }
}

snipetsController.checkRights = async (req, res, next) => {
  const id = req.params.id
  console.log('id is ', id)
  try {
    const snipet = await Snipet.findById({ _id: id })
    let user = snipet.user
    user = user.toString()
    if (user === req.session.userId && res.locals.loggedIn) {
      next()
    } else {
      res.status(403).send('forbidden')
    }
  } catch (error) {
    console.log(error)
  }
}

snipetsController.createPost = async (req, res, next) => {
  const content = req.body.text
  const userid = req.session.userId
  const tags = req.body.tag
  const split = tags.split(',')

  try {
    const user = await User.findOne({ _id: userid })
    const snipet = new Snipet({
      content,
      user
    })
    if (tags.length !== 0) {
      for (let element of split) {
        console.log(element)
        element = element.trim()
        const tag = await Tag.findOne({ name: element })
        if (tag) {
          snipet.tag.push(tag)
          await snipet.save()
          tag.snipet.push(snipet)
          await tag.save()
        } else {
          const newTag = new Tag({
            name: element
          })
          await snipet.save()
          newTag.snipet.push(snipet)
          await newTag.save()
          snipet.tag.push(newTag)
          await snipet.save()
        }
        user.snipets.push(snipet)
        await user.save()
      }
    } else {
      await snipet.save()
      user.snipets.push(snipet)
      await user.save()
    }
    req.session.flash = { type: 'success', text: 'snipet succesfuly saved' }
    res.redirect('/snipets/create')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    return res.redirect('/snipets/create')
  }
}

snipetsController.usersPost = async (req, res, next) => {
  const userid = req.params.id
  const snips = await Snipet.find({ user: userid })
  res.render('user/index', { snips })
}

snipetsController.userEdit = async (req, res, next) => {
  const snipetid = req.params.id
  try {
    const snipetEdit = await Snipet.findOne({ _id: snipetid })
    res.render('snipets/create', { snipetEdit })
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    return res.redirect('/snipets')
  }
}

snipetsController.editPost = async (req, res, next) => {
  const snipetid = req.params.id
  try {
    const snipetEdit = await Snipet.findOne({ _id: snipetid })
    snipetEdit.content = req.body.text
    await snipetEdit.save()
    req.session.flash = { type: 'success', text: 'snipet succesfuly updated' }
    return res.redirect('/snipets/user/' + req.session.userId)
  } catch (error) {
    req.session.flash = { type: 'danger', text: 'Some error occured while updating' }
    return res.redirect('/snipets')
  }
}

snipetsController.userDeletePost = async (req, res, next) => {
  const snipetid = req.params.id
  try {
    const snipet = await Snipet.findOne({ _id: snipetid })
    await snipet.remove()
    req.session.flash = { type: 'success', text: 'snipet succesfuly deleted' }
    return res.redirect('/snipets/user/' + req.session.userId)
  } catch (error) {
    req.session.flash = { type: 'danger', text: 'Some error occured while deleting' }
    return res.redirect('/snipets')
  }
}

module.exports = snipetsController
