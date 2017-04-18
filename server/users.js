'use strict'

const db = require('APP/db')
const User = db.model('users')

const { mustBeLoggedIn, forbidden, selfOnly } = require('./auth.filters')

module.exports = require('express').Router()
  .get('/',
  // The forbidden middleware will fail *all* requests to list users.
  // Remove it if you want to allow anyone to list all users on the site.
  //
  // If you want to only let admins list all the users, then you'll
  // have to add a role column to the users table to support
  // the concept of admin users.
  // mustBeAdmin,
  (req, res, next) =>
    User.findAll()
      .then(users => res.json(users))
      .catch(next))
  .post('/',
  (req, res, next) =>
    User.create(req.body)
      .then(user => res.status(201).json(user))
      .catch(next))
  .get('/:id',
  mustBeLoggedIn,
  (req, res, next) =>
    User.findById(req.params.id)
      .then(user => res.json(user))
      .catch(next))
  .delete('/:id', (req, res, next) =>
    User.destroy({
      where: {
        id: req.params.id,
      }
    })
      .then((result) => result === 0 ? res.sendStatus(404) : res.sendStatus(204))
      .catch(next)
  )
  .put('/:id',
  selfOnly,
  (req, res, next) =>
    User.update(req.body, {
      where: {
        id: req.params.id,
      },
      returning: true,
    })
      .then(allReturned => allReturned[1][0])
      .then(actualUser => {
        actualUser === undefined ? res.sendStatus(500) : res.send(actualUser)
      })
      .catch(next)
  )

// TODOS
// GET
// X Find all users (admins)
// X Find users by ID

// POST
// X Add a user

// UPDATE
// X admin and only currently logged-in user: update user

// DELETE
// X admins: delete a user
