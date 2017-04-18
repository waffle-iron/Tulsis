'use strict'

const db = require('APP/db')
const Order = db.model('orders')
const OrderItem = db.model('orderItem')
const User = db.model('users') // for orders by a user
const { mustBeLoggedIn, forbidden, selfOnly } = require('./auth.filters')

module.exports = require('express').Router()
  .get('/',
  // The forbidden middleware will fail *all* requests to list orders.
  // Remove it if you want to allow anyone to list all orders on the site.
  //
  // If you want to only let admins list all the orders, then you'll
  // have to add a role column to the orders table to support
  // the concept of admin orders.

  // admin should see everything,
  // TODO create an admin filter!
  (req, res, next) =>
    Order.findAll()
      .then(orders => res.json(orders))
      .catch(next))

  // GET route for order by user
  .get('/:userId',
  selfOnly,
  (req, res, next) =>
    Order.find({
      where: {
        // check association to find db field name
        userId: req.params.userId
      }
    })
      .then((orders) => res.json(orders))
      .catch(next)
  )

  // POST route to create an order
  .post('/',
  (req, res, next) =>
    Order.create(req.body)
      .then(order => res.status(201).json(order))
      .catch(next))

  // GET route to find order by ID
  .get('/:id',
  selfOnly,
  (req, res, next) =>
    Order.findById(req.params.id)
      .then(order => res.json(order))
      .catch(next))

  // PUT route to update an order from the request body
  .put('/:id',
  (req, res, next) =>
    Order.update(req.body, {
      where: {
        id: req.params.id,
      },
      returning: true,
    })
      .then((allReturned) =>
        allReturned[1][0]
      )
      .then(updatedOrder => {
        if (updatedOrder === undefined) {
          res.status(500)
          next()
        } else {
          res.send(updatedOrder)
        }
      })
      .catch(next)
  )
    // PUT route to add an order item to an order from the request body
  // .put('/:id/items/:itemId',
  // (req, res, next) =>
    // OrderItem.create({
      //get the product id
      //get product quantity  from req.body
      //create an orderItem
      //current problem is we have an order_item_id on the product table - we want this in a separate table
    // })
       // )

  // DELETE route to remove an order
  .delete('/:id', (req, res, next) =>
    Order.destroy({
      where: {
        id: req.params.id,
      }
    })
      .then((result) => {
        if (result === 0) {
          res.sendStatus(404)
        } else {
          res.sendStatus(204)
        }
      })
      .catch(next)
  )

// TODOS
// GET
// X Find all orders
// X Find orders by ID

// POST
// X Add a order
// Add an order item to an order

// UPDATE
// X admin and only currently logged-in order: update order
// update the quantity of an order item within an order (off of the body)
// delete an order item from an order without deleting the entire order itself (either entering 0 for quantity or trashing the item)

// DELETE
// X admins: delete a order
