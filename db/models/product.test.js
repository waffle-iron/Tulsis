'use strict'

import chai from 'chai'
import chaiProperties from 'chai-properties'
import chaiThings from 'chai-things'
chai.use(chaiProperties)
chai.use(chaiThings)

const db = require('APP/db')
  , { Product } = db
  , { expect } = require('chai')
// , { should } = require('chai')

/* global describe it before afterEach */

describe('Product', () => {
  before('Await database sync', () => db.didSync)
  afterEach('Clear the tables', () => db.truncate({ cascade: true }))

  var product

  describe('product association methods', () => {
    before('Create product instance', () =>
      Product.create({
        title: 'booties',
        description: 'cute booties for your baby',
        price: 12,
        photoUrl: 'img.jpg',
        quantity: 1,
        category: ['pink']
      })
        .then((_product) => product = _product)
    )
    it('has setLovers method', () => {
      expect(product.setLovers).to.be.a('function')
    })
  })

  describe('product model validation', () => {
    it('throws a validation error if product is created without a title', () => {
      const product = Product.build({
        description: 'cute booties for your baby',
        price: 12,
        photoUrl: 'img.jpg',
        quantity: 1,
        category: ['pink']
      })
      return product.validate()
        .then(err => {
          expect(err).to.be.an('object')
          expect(err.errors).to.contain.a.thing.with.properties({
            path: 'title',
            type: 'notNull Violation'
          })
        })
    })
  })
})

// could add more tests once models have more methods
