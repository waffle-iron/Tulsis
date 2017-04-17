const db = require('APP/db')
const User = db.model('users')

const mustBeLoggedIn = (req, res, next) => {
  console.log('REQ FROM MUSTBELOGGEDIN: ', req.user)
  if (!req.user) {
    return res.status(401).send('You must be logged in')
  }
  next()
}

const selfOnly = action => (req, res, next) => {
  if (req.params.id !== req.user.id) {
    return res.status(403).send(`You can only ${action} yourself.`)
  }
  next()
}

const forbidden = message => (req, res) => {
  res.status(403).send(message)
}

const mustBeAdmin = action => (req, res, next) => {
  User.findById(req.params.id)
}

module.exports = { mustBeLoggedIn, selfOnly, forbidden, mustBeAdmin }
