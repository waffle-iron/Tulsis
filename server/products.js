// TODOS
// GET
// Find all products
// Find products by ID

// POST
// Add a product

// UPDATE
// admin: update product

// DELETE
// admins: delete a product

'use strict'

const db = require('APP/db')
const Product = db.model('Products')

const { mustBeLoggedIn, forbidden } = require('./auth.filters')

module.exports = require('express').Router()
  .get('/', (req, res, next) =>
    // The forbidden middleware will fail *all* requests to list Products.
    // Remove it if you want to allow anyone to list all Products on the site.
    //
    // If you want to only let admins list all the products, then you'll
    // have to add a role column to the users table to support
    // the concept of admin users.
    Product.findAll()
      .then(Products => res.json(products))
      .catch(next))
  .post('/',
  (req, res, next) =>
    Product.create(req.body)
      .then(product => res.status(201).json(product))
      .catch(next))
  .get('/:id',
  (req, res, next) =>
    Product.findById(req.params.id)
      .then(product => res.json(product))
      .catch(next))
