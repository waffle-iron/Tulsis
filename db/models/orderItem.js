const {INTEGER} = require('sequelize')

module.exports = db => db.define('orderItems', {
  quantity: INTEGER,
})

module.exports.associations = (OrderItem, {Product, Order}) => {
  OrderItem.belongsTo(Order)
  OrderItem.hasOne(Product)
}

// Does sequelize store the previous values of an object?
