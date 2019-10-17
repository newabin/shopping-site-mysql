const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

const sequelize = require('./util/sqldb')
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')
const Order = require('./models/order')
const OrderItem = require('./models/order-item')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const errorController = require('./controllers/error') 

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req,res,next)=>{
  User.findByPk(1).then((user)=>{
    req.user = user
    next()
  }).catch((err)=>{
    console.log(err)
  })
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404page)

Product.belongsTo(User, { constraints : true, onDelete : 'CASCADE'})
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, { through : CartItem})
Product.belongsToMany(Cart, { through : CartItem})
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product, { through : OrderItem})
Product.belongsToMany(Order, { through : OrderItem})

sequelize.sync().then(()=>{
  return User.findByPk(1)
}).then((user)=>{
  if(!user){
    return User.create({name : 'Pravinewa', email : 'whopravinewa@gmail.com', password : 'qwerty'})
  }
  return user
}).then((user)=>{
  return user.createCart()
}).then((cart)=>{
//  console.log(user)
  app.listen(4444,()=>{
    console.log('Listening at port 4444')
  })  
}).catch((err)=>{
  console.log(err)
})

