//blog routes
const express = require('express');
const Product = require('./../models/Product');
const middle = require("../middleware/auth")
const router = express.Router();
const multer = require('multer');
const productController = require("../controller/product")
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
    console.log(req.params.slug)
    let product = await Product.findOne({ slug: req.params.slug});
    if (product){
        res.render('show', { product: product});
    } else{
        res.redirect('/');
    }
})


//route that handles new products
router.post('/add-products',upload.single('image'), productController.handleNew)

// route that handles edit
router.get('/edit/:id', middle.isLogin, productController.handleEdit)

//route to handle update
router.put('/:id', upload.single('image'), middle.isLogin, productController.handleUpdate)

//route to handle delete product
router.delete('/:id', middle.isLogin, productController.handleDelete)

module.exports = router;