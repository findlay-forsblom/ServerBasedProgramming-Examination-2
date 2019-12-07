const Snipet = require('../models/snipet.js')
const User = require('../models/user.js')
const Tag = require('../models/tag.js')

const snipetsController = {}

snipetsController.index = async (req, res, next) => {
  const snipets = []

  Snipet.find().populate('user').populate('tag').exec((err, snipet) => {
    if (err) {
      console.log(err) // TODO Throw server error
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
  const snips = []
  await Snipet.find({ user: userid }).populate('user').populate('tag').exec(async (err, snipet) => {
    if (err) {
      console.log(err) // TODO fix EROOR MANAGENMENT
    } else {
      snipet.forEach(snip => {
        console.log(snip)
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
            tag: str
          }
        )
        console.log('my name is ', str)
        console.log(snips)
      })
    }
    if (snips.length > 0) {
      const user = snips[0].user
      const lol = {}
      lol.name = user
      res.locals.user = lol
      console.log(user)
    } else {
      const user = await User.findById({ _id: userid })
      const lol = {}
      lol.name = user.username
      console.log(user.username)
      res.locals.user = lol
    }
    res.render('user/index', { snips })
  })
}

snipetsController.userEdit = async (req, res, next) => {
  const snipetid = req.params.id
  Snipet.findOne({ _id: snipetid }).populate('tag').exec((err, snipet) => {
    if (err) {
      console.log(err) //TODO FIX ERROR MANAGEMENT
    } else {
      console.log(snipet.tag)
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
      res.render('snipets/create', { snipetEdit })
    }
  })
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

snipetsController.tags = async (req, res, next) => {
  const tags = await Tag.find()
  const allTags = []
  tags.forEach(tag => {
    console.log(tag)
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
  console.log(allTags)
  res.render('snipets/tags', { allTags })
}

snipetsController.getTags = async (req, res, next) => {
  const id = req.params.id
  const snips = []
  const tag = await Tag.findById({ _id: id })
  const lol = {}
  lol.name = tag.name
  console.log(lol)
  res.locals.tagName = lol
  Snipet.find({ tag: { $in: id } }).populate('user').exec((err, snipet) => {
    if (err) {
      console.log(err)//TODOD FIX THAT SHIT
    } else {
      snipet.forEach(snip => {
        snips.push(
          {
            user: snip.user.username,
            id: snip._id,
            content: snip.content
          }
        )
      })
      console.log(snips)
    }
    res.render('snipets/index', { snips })
  })


  // Tag.findOne({ _id: id }).populate('snipet').exec((err, tag) => {
  //   if (err) {
  //     console.log(err)
  //   } else {
  //     console.log(tag)
  //     // tag.snipet.forEach(lol => {
  //     //   console.log(lol)
  //     // })
  //   }
  // })
}

module.exports = snipetsController
