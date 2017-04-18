'use strict'

const db = require('APP/db')
const Product = db.model('products')

const { mustBeLoggedIn, forbidden, selfOnly } = require('./auth.filters')

module.exports = require('express').Router()
  .get('/', (req, res, next) =>
    // The forbidden middleware will fail *all* requests to list Products.
    // Remove it if you want to allow anyone to list all Products on the site.
    //
    // If you want to only let admins list all the products, then you'll
    // have to add a role column to the users table to support
    // the concept of admin users.
    Product.findAll()
      .then(products => res.json(products))
      .catch(next))
  .post('/',
  (req, res, next) =>
    Product.create(req.body)
      .then(product => res.status(201).json(product))
      .catch(next))
  .get('/:id',
  (req, res, next) =>
    Product.findById(req.params.id)
      .then(product => {
        res.json(product)
      }
      )
      .catch(next))

  .put('/:id', (req, res, next) =>
    Product.update(req.body, {
      where: {
        id: req.params.id
      },
      returning: true
    })
      .then(response => response[1][0])
      .then((actualResponse) => res.send(actualResponse))
      .catch(next)
  )

  .delete('/:id', (req, res, next) =>
    Product.destroy({
      where: {
        id: req.params.id
      }
    })
      .then((result) => result === 0 ? res.sendStatus(404) : res.sendStatus(204))
      .catch(next)
  )

// TODOS
// GET
// X Find all products
// X Find products by ID

// POST
// X Add a product

// UPDATE
// X admin: update product

// DELETE
// X admins: delete a product
