'use strict'

const db = require('APP/db')
const Review = db.model('reviews')
const User = db.model('users') // for orders by a user
const Product = db.model('products')
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
    Review.findAll()
      .then(reviews => res.json(reviews))
      .catch(next))

  // POST route to create an Review
  .post('/',
  selfOnly,
  (req, res, next) =>
    Review.create(req.body)
      .then(review => res.status(201).json(review))
      .catch(next))

  // GET route to find review by reviewID
  .get('/:id',
  (req, res, next) =>
    Review.findById(req.params.id)
      .then(review => res.json(review))
      .catch(next))

  // GET route to find all reviews for particular userId
  .get('/users/:userId',
  (req, res, next) =>
    Review.find({
      where: {
        userId: req.params.userId // check model!
      }
    })
      .then(reviews => res.json(reviews))
      .catch(next))

  // GET route to find all reviews for particular productId
  .get('/products/:productId',
  (req, res, next) =>
    Review.find({
      where: {
        productId: req.params.productId // check model!
      }
    })
      .then(reviews => res.json(reviews))
      .catch(next))

  // PUT route to update an Review from the request body
  .put('/:id',
  (req, res, next) =>
    Review.update(req.body, {
      where: {
        id: req.params.id,
      },
      returning: true,
    })
      .then((allReturned) =>
        allReturned[1][0]
      )
      .then(updatedReview => {
        if (updatedReview === undefined) {
          res.status(500)
          next()
        } else {
          res.send(updatedReview)
        }
      })
      .catch(next)

  )

  // DELETE route to remove an order
  .delete('/:id', (req, res, next) =>
    Review.destroy({
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
// X Find all reviews
// X Find review by ID
// X Find all reviews by productId
// X Find all reviews by userId

// POST
// X Add a Review

// UPDATE
// X admin and only currently logged-in review: update review

// DELETE
// X admins: delete a review
