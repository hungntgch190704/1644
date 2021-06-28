//blog routes
const express = require('express');
const Product = require('./../models/Product');
const middle = require("../middleware/auth")
const validate = require("../middleware/validate")
const router = express.Router();
const multer = require('multer');
const flash = require('connect-flash');
//define storage for the images 
const storage = multer.diskStorage({
    destination:function(req, file, callback){
        callback(null, './public/uploads/images');
    },

    //add back the extension
    filename:function(req, file, callback){
        callback(null, Date.now()+file.originalname);
    },
})

//upload parameters for multer
const upload = multer({
    storage:storage,
    limits:{
        fieldSize:1024*1024*3
    },
})

router.get('/new', middle.isLogin, (req, res) => {
    res.render('new');
})

router.get('/home', middle.isLogin,  async (req, res) =>{
    let posts = await Product.find().sort({timeCreated:'desc'});
    res.render('home', { posts: posts })
})

router.get('/:slug', middle.isLogin, async (req, res) => {
    let product = await Product.findOne({ slug: req.params.slug});

    if (product){
        res.render('show', { product: product});
    } else{
        res.redirect('/');
    }
})


//route that handles new products
router.post('/',upload.single('image'), middle.isLogin, async (req, res) => {
    //console.log(req.body);

    let product = new Product({
        title: req.body.title,
        price:req.body.price,
        description: req.body.description,
        img:req.file.filename,
    });

    try{
        product = await product.save();
        res.redirect(`/products/${product.slug}`);
    }
    catch(error){
        console.log(error);
    }
})

//route that handles edit
router.get('/edit/:id', middle.isLogin, async (req, res) => {
    let product = await Product.findById(req.params.id);
    response = {}
    response['product'] = product;
    message = req.flash('message') 
    if(message !== "") {
        response['error'] = message
    }
    res.render('edit', {response: response}, )
})

//route to handle update
router.put('/:id', upload.single('image'), middle.isLogin, validate.validateInput, async (req, res) => {
    product = await Product.findById(req.params.id);
    product.title = req.body.title;
    product.price = req.body.price;
    product.description = req.body.description;
    product.img = req.file.filename;
    try{
        product = await product.save();
        //redirect to the view route
        res.redirect(`/products/${product.slug}`)
    } catch(error){
        console.log(error);
        res.redirect(`products/edit/${product.id}`, {product:product})
    }
})

//route to handle delete product
router.delete('/:id', middle.isLogin, async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products/home');
})

module.exports = router;