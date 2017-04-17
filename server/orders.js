'use strict'

const db = require('APP/db')
const Order = db.model('orders')
const User = db.model('users')//for orders by a user
const { mustBeLoggedIn, forbidden } = require('./auth.filters')

module.exports = require('express').Router()
  .get('/',
  // The forbidden middleware will fail *all* requests to list orders.
  // Remove it if you want to allow anyone to list all orders on the site.
  //
  // If you want to only let admins list all the orders, then you'll
  // have to add a role column to the orders table to support
  // the concept of admin orders.
  mustBeLoggedIn,
  // admin should see everything,
  // TODO create an admin filter!
  (req, res, next) =>
    Order.findAll()
      .then(orders => res.json(orders))
      .catch(next))

  //all orders for a user:
  //TODO filter for orders by userId
  .get('/:userId',
  mustBeLoggedIn,
  (req, res, next) =>
    Order.find({
      where: {
        //check association to find db field name
        userId: req.params.userId
      }
    })
    .then((orders) => res.json(orders))
    .catch(next)
  )

  .post('/',
  (req, res, next) =>
    Order.create(req.body)
      .then(order => res.status(201).json(order))
      .catch(next))

  .get('/:id',
  mustBeLoggedIn,
  (req, res, next) =>
    Order.findById(req.params.id)
      .then(order => res.json(order))
      .catch(next))

  .put('/:id',
  (req, res, next) =>
    Order.update(req.body, {
      where: {
        id: req.params.id,
      },
      returning: true,
    })
    .then((allReturned) =>
      return allReturned[1][0]
    )
    .then(updatedOrder =>
      if (updatedOrder === undefined) {
        res.status(500)
        next();
      } else {
        res.send(updatedOrder)
      })
    .catch(next)
  )

// router.put('/:id', function(req, res, next) {
//   Book.update(req.body, {
//     where: {
//       id: req.params.id,
//     },
//     returning: true,
//   }).then(function(allReturned) {
//     return allReturned[1][0];//herereq
//   }).then(function(actualUpdatedBook) {
//     if (actualUpdatedBook === undefined) {
//       res.status(500)
//       next();
//     } else {
//       res.send(actualUpdatedBook);
//     }
//   }).catch(next);
// });

// TODOS
// GET
// Find all orders
// Find orders by ID

// POST
// Add a order

// UPDATE
// admin and only currently logged-in order: update order

// DELETE
// admins: delete a order
