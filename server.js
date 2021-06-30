const express = require('express');
const productRouter = require('./routes/products');
const session = require("express-session");
const authRoutes = require('./routes/auth');


const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://hungnt:hwng.nt1608@cluster0.mrpik.mongodb.net/test',
    { useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true },
);
app.use(session({secret: 'secret_key',saveUninitialized: true,resave: true}));

app.use(express.static(__dirname + '/public'));
//bring in method override
const methodOverride = require('method-override');

app.set('view engine', 'hbs');
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));
//route for the index page
app.get('/', (req, res) =>{
    res.render('index')
});

app.use(express.static("public"));
app.use(authRoutes);
app.use('/products', productRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT);
console.debug('Server listening on port' + PORT);


