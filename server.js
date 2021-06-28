const express = require('express');
const productRouter = require('./routes/products')
const bcrypt = require ('bcrypt');
const session = require("express-session");
const Product = require('./models/Product');
const flash = require('connect-flash');

const authRoutes = require('./routes/auth');

const app = express();
app.use(session({secret: 'secret_key',saveUninitialized: true,resave: true}));
//bring in method override
const methodOverride = require('method-override');

app.set('view engine', 'hbs');
app.use(express.urlencoded({extended:false}))
app.use(methodOverride('_method'));
//route for the index page
app.get('/', (req, res) =>{
    res.render('index')
})

app.use(flash());
app.use(express.static("public"))
app.use(authRoutes)
app.use('/products', productRouter)

const PORT = process.env.PORT || 8080
app.listen(PORT);
console.debug('Server listening on port' + PORT);


