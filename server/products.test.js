const request = require('supertest')
  , { expect } = require('chai')
  , db = require('APP/db')
  , app = require('./start')

/* global describe it before afterEach */

describe('/api/products', () => {
  before('Await database sync', () => db.didSync)
  afterEach('Clear the tables', () => db.truncate({ cascade: true }))

  describe('GET /', () =>
    describe('when there are no products', () =>
      it('fails with a 403 (Not found)', () =>
        request(app)
          .get(`/api/products`)
          .expect(403)
      )))

  describe('GET /:id', () =>
    describe('when product does not exist', () =>
      it('fails with a 403 (Not found)', () =>
        request(app)
          .get(`/api/products/945`)
          .expect(403)
      )))

  describe('POST', () =>
    describe('only admin can add a product', () => {
      it('creates a product', () =>
        request(app)
          .post('/api/products')
          .send({
            name: 'booties',
            price: 12
          })
          .expect(201))

      it('redirects to the product it just made', () =>
        request(app)
          .post('/api/products')
          .send({
            name: 'booties',
            price: 12
          })
          .redirects(1)
          .then(res => expect(res.body).to.contain({
            name: 'booties',
            price: 12
          })))
    }))

  describe('PUT', () =>
    describe('only admin can edit a product', () => {
      it('updates a product', () =>
        request(app)
          .put('/api/products/1')
          .send({
            name: 'new booties',
            price: 24
          })
          .expect(200))

      it('redirects to the product it just made', () =>
        request(app)
          .put('/api/products/1')
          .send({
            name: 'new booties',
            price: 24
          })
          .redirects(1)
          .then(res => expect(res.body).to.contain({
            name: 'new booties',
            price: 24
          })))
    }))

  // describe('DELETE', () =>
  //   describe('only admin can delete a product', () => {
  //     before('Creates a product', () =>
  //       request(app)
  //         .post('/api/products')
  //         .send({
  //           name: 'deleteMe',
  //           price: 500
  //         }))
  //     it('deletes a product', () =>
  //       request(app)
  //         .delete('/api/products')
  //         .send({
  //           name: 'booties',
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
