// Somehow require in user and order models

module.exports = db => db.define('userOrders', {
    quantity: INTEGER,
    }

  // Does sequelize store the previous values of an object?