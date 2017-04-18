const request = require('supertest')
  , { expect } = require('chai')
  , db = require('APP/db')
  , app = require('./start')
  , Order = db.model('orders')

/* global describe it before afterEach */

describe('/api/orders', () => {
  before('Await database sync', () => db.didSync)
  afterEach('Clear the tables', () => db.truncate({ cascade: true }))

  describe('GET /', () =>
    describe('when there are or are not orders', () =>
      it('responds with a status of 200 with orders or an empty set', () =>
        request(app)
          .get(`/api/orders`)
          .expect(200)
      )
      ))
})
