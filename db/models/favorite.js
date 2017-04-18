'use strict'

const {STRING} = require('sequelize')

module.exports = db => db.define('favorites')

module.exports.associations = (Favorite, {Product, User}) => {
  Favorite.belongsTo(Product)
  Favorite.belongsTo(User)
}
