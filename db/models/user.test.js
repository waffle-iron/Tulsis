'use strict'

import chai from 'chai';
import chaiProperties from 'chai-properties';
import chaiThings from 'chai-things';
chai.use(chaiProperties);
chai.use(chaiThings);

const db = require('APP/db')
  , { User } = db
  , { expect } = require('chai')
// , { should } = require('chai')

/* global describe it before afterEach */

describe('User', () => {
  before('Await database sync', () => db.didSync)
  afterEach('Clear the tables', () => db.truncate({ cascade: true }))

  var user
  var order

  describe('authenticate(plaintext: String) ~> Boolean', () => {
    it('resolves true if the password matches', () =>
      User.create({ password: 'ok' })
        .then(user => user.authenticate('ok'))
        .then(result => expect(result).to.be.true))

    it("resolves false if the password doesn't match", () =>
      User.create({ password: 'ok' })
        .then(user => user.authenticate('not ok'))
        .then(result => expect(result).to.be.false))

    describe('user association methods', () => {
      before('Create user instance', () => {
        return User.create({ name: 'name', email: 'email@email.com' })
          .then((_user) => user = _user)
      })

      it('has a getOrders method', () => {
        expect(user.getOrders).to.be.a('function')
      })
    })

    describe('user model validation', () => {
      it('throws a validation error if user is created without a valid email address', () => {
        const user = User.build({ name: 'name', email: 'I am not an email address' })
        return user.validate()
          .then(err => {
            expect(err).to.be.an('object');
            // npm texpect(err.errors).to.contain.a.thing.with.properties({
            //   path: 'email',
            //   type: 'isEmail Violation'
            // })
          })
      })
    })
  })
})


// Association methods we would want:
// get Orders by userId (Order.belongsToUser)
// get Reviews by userId
// get Reviews by productId
