const express = require('express')
const hbs = require('express-hbs')
const path = require('path')
const mongoose = require('./config/mongoose.js')
const session = require('express-session')
const port = 8000
const helmet = require('helmet')

const SESSION_NAME = 'sid'
const SESSION_SECRET = 'sshh!/it/s/a/secret/dontTell!!!'

module.exports = SESSION_NAME

const app = express()

app.use(express.urlencoded({ extended: false }))

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", 'https://code.jquery.com/jquery-3.4.1.slim.min.js', 'https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js', 'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js'],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css']
  }
}))

app.use(helmet.hidePoweredBy())

app.use(helmet.xssFilter())

const sessionOptions = {
  name: SESSION_NAME,
  secret: SESSION_SECRET,
  resave: false, // Resave even if a request is not changing the session.
  saveUninitialized: false, // Don't save a created but not modified session.
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: true
  }
}

app.use(session(sessionOptions))

mongoose.connect().catch(error => {
  console.log(error)
  process.exit(1)
})

app.engine('hbs', hbs.express4({
  defaultLayout: path.join(__dirname, 'views', 'layouts', 'default'),
  partialsDir: path.join(__dirname, 'views', 'partials')
}))
app.set('view engine', 'hbs')
// app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  // flash messages - survives only a round trip
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }
  if (req.session.userId) {
    const lol = {}
    lol.id = req.session.userId
    res.locals.loggedIn = lol
  }

  next()
})

// default route
app.use('/', require('./routes/homeRouter.js'))
app.use('/snipets', require('./routes/snipetsRouter.js'))

// catches 404
app.use((req, res, next) => {
  res.status(404)
  res.sendFile(path.join(__dirname, 'public', '404.html'))
})

//TODO FIXA 500

app.listen(port, () => console.log('Server running at http://localhost:' + port))
