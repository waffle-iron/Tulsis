const {INTEGER, TEXT} = require('sequelize')

module.exports = db => db.define('reviews', {
  rating: INTEGER,
  content: TEXT,
})

module.exports.associations = (Review, {User, Product}) => {
  Review.belongsTo(User)
  Review.belongsTo(Product)
}


