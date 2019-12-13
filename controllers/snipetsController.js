'use strict'
const Snipet = require('../models/snipet.js')
const User = require('../models/user.js')
const Tag = require('../models/tag.js')
const moment = require('moment')
const mongoose = require('mongoose')
const tagCreator = require('../libs/tagCreator.js')

const snipetsController = {}
const err = {}

snipetsController.index = async (req, res, next) => {
  const snipets = []

  Snipet.find().populate('user').populate('tag').exec((err, snipet) => {
    if (err) {
      console.log(err)
      return next(err)
    } else {
      snipet.forEach(snip => {
        let str = ''
        snip.tag.forEach((tag, i) => {
          if (i === snip.tag.length - 1) {
            str += tag.name
          } else {
            str += tag.name + ', '
          }
        })
        snipets.push(
          {
            user: snip.user.username,
            id: snip._id,
            content: snip.content,
            created: moment(snip.created).format('MMMM Do YYYY, h:mm a'),
            tag: str
          }
        )
      })
      res.render('snipets/index', { snipets })
    }
  })
}

snipetsController.create = (req, res, next) => {
  res.render('snipets/create')
}

snipetsController.authorization = (req, res, next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    req.session.flash = { type: 'danger', text: 'You have to log in first to create post, Or register an account if new' }
    req.session.redirectCreate = true
    res.redirect('/login')
  }
}

snipetsController.checkSameUser = (req, res, next) => {
  const id = req.params.id
  if (id === req.session.userId && res.locals.loggedIn) {
    next()
  } else {
    err.status = 403
    return next(err)
  }
}

snipetsController.checkRights = async (req, res, next) => {
  const id = req.params.id
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      err.status = 404
      return next(err)
    }
    const snipet = await Snipet.findById({ _id: id })
    if (snipet) {
      let user = snipet.user
      user = user.toString()
      if (user === req.session.userId && res.locals.loggedIn) {
        next()
      } else {
        err.status = 403
        return next(err)
      }
    } else {
      err.status = 404
      return next(err)
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
}

snipetsController.createPost = async (req, res, next) => {
  const content = req.body.text
  const userid = req.session.userId
  const tags = req.body.tag
  let tagCapitalized = tags.toLowerCase()
  tagCapitalized = tagCapitalized.charAt(0).toUpperCase() + tagCapitalized.slice(1)
  const split = tagCapitalized.split(',')

  try {
    const user = await User.findOne({ _id: userid })
    const snipet = new Snipet({
      content,
      user,
      created: Date.now(),
      lastUpdated: Date.now()
    })
    if (tags.length !== 0) {
      await tagCreator.create(split, snipet, Tag, user)
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
  const snips = []
  await Snipet.find({ user: userid }).populate('user').populate('tag').exec(async (err, snipet) => {
    if (err) {
      console.log(err)
      return next(err)
    } else {
      snipet.forEach(snip => {
        let str = ''
        snip.tag.forEach((tag, i) => {
          if (i === snip.tag.length - 1) {
            str += tag.name
          } else {
            str += tag.name + ', '
          }
        })
        snips.push(
          {
            user: snip.user.username,
            id: snip._id,
            content: snip.content,
            created: moment(snip.created).format('MMMM Do YYYY, h:mm a'),
            lastUpdated: moment(snip.lastUpdated).format('MMMM Do YYYY, h:mm a'),
            tag: str,
            csrfToken: req.csrfToken()
          }
        )
      })
    }
    if (snips.length > 0) {
      const user = snips[0].user
      const lol = {}
      lol.name = user
      res.locals.user = lol
    } else {
      const user = await User.findById({ _id: userid })
      const lol = {}
      lol.name = user.username
      res.locals.user = lol
    }
    res.render('user/index', { snips })
  })
}

snipetsController.userEdit = async (req, res, next) => {
  const snipetid = req.params.id
  Snipet.findOne({ _id: snipetid }).populate('tag').exec((err, snipet) => {
    if (err) {
      console.log(err)
      return next(err)
    } else {
      let str = ''
      snipet.tag.forEach((tag, i) => {
        if (i === snipet.tag.length - 1) {
          str += tag.name
        } else {
          str += tag.name + ', '
        }
      })
      const snipetEdit =
          {
            user: snipet.user.username,
            id: snipet._id,
            content: snipet.content,
            tag: str
          }
      res.render('snipets/create', { snipetEdit, csrfToken: req.csrfToken() })
    }
  })
}

snipetsController.editPost = async (req, res, next) => {
  const snipetid = req.params.id
  const tags = req.body.tag
  const split = tags.split(',')
  try {
    const snipet = await Snipet.findOne({ _id: snipetid })

    await mongoose.model('Tag').updateMany(
      { _id: { $in: snipet.tag } },
      { $pull: { snipet: snipet.id } },
      { multi: true }
    )
    await snipet.updateOne({
      content: req.body.text,
      tag: [],
      lastUpdated: Date.now()
    })

    if (tags.length !== 0) {
      await tagCreator.create(split, snipet, Tag)
    }
    req.session.flash = { type: 'success', text: 'snipet succesfuly updated' }
    return res.redirect('/snipets/user/' + req.session.userId)
  } catch (error) {
    console.log(error)
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

snipetsController.tags = async (req, res, next) => {
  const tags = await Tag.find()
  const allTags = []
  tags.forEach(tag => {
    const length = tag.snipet.length
    if (length > 0) {
      allTags.push(
        {
          id: tag._id,
          name: tag.name,
          length: length
        }
      )
    }
  })
  res.render('snipets/tags', { allTags })
}

snipetsController.getTags = async (req, res, next) => {
  const id = req.params.id
  const snips = []
  const tag = await Tag.findById({ _id: id })
  const lol = {}
  lol.name = tag.name
  res.locals.tagName = lol
  Snipet.find({ tag: { $in: id } }).populate('user').exec((err, snipet) => {
    if (err) {
      console.log(err)
      next(err)
    } else {
      snipet.forEach(snip => {
        snips.push(
          {
            user: snip.user.username,
            id: snip._id,
            content: snip.content,
            created: moment(snip.created).format('MMMM Do YYYY, h:mm a')
          }
        )
      })
    }
    res.render('snipets/index', { snips })
  })
}

module.exports = snipetsController
