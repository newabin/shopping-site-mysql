const Sequelize = require('sequelize')
const sequelize = require('../util/sqldb')

const CartItem = sequelize.define('cartItem',{
    id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
    },
    quantity : {
        type : Sequelize.INTEGER,
        allowNull : false
    }
})


module.exports = CartItem