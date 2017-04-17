const request = require('supertest')
  , { expect } = require('chai')
  , db = require('APP/db')
  , app = require('./start')

/* global describe it before afterEach */


describe('/api/products', () => {
  before('Await database sync', () => db.didSync)
  afterEach('Clear the tables', () => db.truncate({ cascade: true }))

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
})
