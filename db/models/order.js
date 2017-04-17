'use strict'

const {STRING, TEXT, INTEGER, ARRAY, ENUM} = require('sequelize')

module.exports = db => db.define('orders', {
  id: INTEGER,
  status: ENUM('Pending', 'Completed')
})

module.exports.associations = (Order, {User, Product, UserOrder}) => {
  Order.belongsToMany(Product, {through: UserOrder})
}
