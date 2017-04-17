'use strict'

const {STRING, TEXT, INTEGER, ARRAY, ENUM} = require('sequelize')

// this model refers to a cart of individual order items
module.exports = db => db.define('orders', {
  id: INTEGER,
  status: ENUM('Pending', 'Completed')
})

module.exports.associations = (Order, {User, OrderItem, RenameTable}) => {
  Order.hasMany(OrderItem, {through: RenameTable})
  Order.belongsTo(User)
}

  // Does sequelize store the previous values of an object?
