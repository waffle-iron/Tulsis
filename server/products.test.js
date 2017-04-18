const request = require('supertest')
  , { expect } = require('chai')
  , db = require('APP/db')
  , app = require('./start')
  , Product = db.model('products')

/* global describe it before afterEach */

describe.only('/api/products', () => {
  before('Await database sync', () => db.didSync)
  afterEach('Clear the tables', () => db.truncate({ cascade: true }))

  describe('GET /', () =>
    describe('when there are or are not products', () =>
      it('responds with a status of 200 with products or an empty set', () =>
        request(app)
          .get(`/api/products`)
          .expect(200)
      )))

  describe('GET /:id', () => {
    let id

    before(() => {
      return Product.create({
        title: 'Test Shoes'
      })
        .then(product => {
          // console.log('We made a product', product)
          id = product.id
        })
      // .catch(console.error)
    })

    describe('when a product exists', () =>
      it('it returns the product', () =>
        request(app)
          .get(`/api/products/${id}`)
          .expect(200)
          .then(res => {
            // console.log("Here's our result", res.body)
            expect(res.body.title).to.be.equal('Test Shoes')
          })
          .catch(console.error)
      ))
  })

  describe('POST', () =>
    it('creates a product', () =>
      request(app)
        .post('/api/products')
        .send({
          title: 'booties',
          price: 12
        })
        .expect(201)
    ))

  describe('PUT', () => {
    let id
    before(() => {
      return Product.create({
        title: 'booties',
        price: 12
      })
        .then(product => {
          // console.log('We made a product', product)
          id = product.id
        })
      // .catch(console.error)
    })
    it('updates a product', () => {
      request(app)
        .put(`/api/products/${id}`)
        .send({
          title: 'new booties',
          price: 24
        })
        .expect(200)
        .then(res => {
          expect(res.body.title).to.be.equal('new booties')
        })
    }

    )
  }
  )

  // describe('DELETE', () =>
  //   describe('only admin can delete a product', () => {
  //     before('Creates a product', () =>
  //       request(app)
  //         .post('/api/products')
  //         .send({
  //           title: 'deleteMe',
  //           price: 500
  //         }))
  //     it('deletes a product', () =>
  //       request(app)
  //         .delete('/api/products')
  //         .send({
  //           title: 'booties',
  //           price: 12
  //         })
  //         .expect(201))
})
// TODOS-tests
// GET
// X Find all products
// X Find products by ID

// POST
// X Add a product

// UPDATE
// X admin: update product

// DELETE
// admins: delete a product
