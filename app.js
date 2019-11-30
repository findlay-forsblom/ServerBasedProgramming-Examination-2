const express = require('express')
const hbs = require('express-hbs')
const path = require('path')
// const mongoose = require('./config/mongoose.js')
const session = require('express-session')
const port = 8000

const app = express()

app.engine('hbs', hbs.express4({
  defaultLayout: path.join(__dirname, 'views', 'layouts', 'default'),
  partialsDir: path.join(__dirname, 'views', 'partials')
}))
app.set('view engine', 'hbs')
// app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// default route
app.use('/', require('./routes/homeRouter.js'))
app.use('/snipets', require('./routes/snipetsRouter.js'))

// catches 404
app.use((req, res, next) => {
  res.status(404)
  res.sendFile(path.join(__dirname, 'public', '404.html'))
})

app.listen(port, () => console.log('Server running at http://localhost:' + port))