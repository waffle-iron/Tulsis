const request = require('supertest')
  , { expect } = require('chai')
  , db = require('APP/db')
  , app = require('./start')
  , User = db.model('users')

/* global describe it before afterEach */

describe.only('/api/users', () => {
  before('Await database sync', () => db.didSync)
  afterEach('Clear the tables', () => db.truncate({ cascade: true }))

  describe('GET /:id', () =>
    describe('when not logged in', () =>
      it('fails with a 401 (Unauthorized)', () =>
        request(app)
          .get(`/api/users/1`)
          .expect(401)
      )))

  describe('PUT /:id', () => {
    let id

    before(function() {
      return User.create({
        email: 'wasssupp@gmail.com',
        password: '12345'
      })
        .then(user => {
          console.log('we made the user', user.id)
          id = user.id
        })
        .catch(console.error)
    })

    it('updates a user', () => {
      // Why does this complete before the 'before' block completes?
      console.log('Were searching for user', id)
      request(app)
        .put(`/api/users/${id}`)
        .send({
          email: 'testest@test.com',
        })
        .expect(201)
        .then(res => {
          return User.findById(id)
        })
        .then(user => {
          expect(user.email).to.be.equal('testest@test.com')
        })
        .catch(console.error)
    }

    )

    describe('POST', () =>
      describe('when not logged in', () => {
        it('creates a user', () =>
          request(app)
            .post('/api/users')
            .send({
              email: 'beth@secrets.org',
              password: '12345'
            })
            .expect(201))

        it('redirects to the user it just made', () =>
          request(app)
            .post('/api/users')
            .send({
              email: 'eve@interloper.com',
              password: '23456',
            })
            .redirects(1)
            .then(res => expect(res.body).to.contain({
              email: 'eve@interloper.com'
            })))
      }))

    describe('DELETE /:id', () => {
      let id
      before(function() {
        return User.create({
          email: 'deleteme@gmail.com',
          password: 'aabbcc'
        })
          .then(user => {
            console.log('we made the user to be deleted', user.id)
            id = user.id
          })
          .catch(console.error)
      })
      it('deletes a user', () => {
        // Why does this complete before the 'before' block completes?
        console.log('Were searching for user', id)
        request(app)
          .delete(`/api/users/${id}`)
          .expect(204)
          .catch(console.error)
      }
      )
    })
  })
})
