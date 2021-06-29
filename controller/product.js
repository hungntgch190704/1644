const express = require('express');
const Product = require('./../models/Product');
//delete
exports.handleDelete = (req, res) => {
    console.log(req.params.id);
    Product.findByIdAndDelete(req.params.id).then(data => {
        console.log(data);
    })
    res.redirect('/products/home');
}
//handleUpdate
exports.handleUpdate = async (req, res) => {
    product = await Product.findById(req.params.id);
    let title = /^[a-zA-Z ]+$/.test(req.body.title);
    let price = /[(0-9)+.?(0-9)*]+$/.test(req.body.price);
    let img = (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(req.file.filename);
    let flag = true;
    let errors = [];
    if(!title){
        errors["title"] = 'Title is invalid';
        flag = false;
    }
    if(!price){
        errors["price"] = 'Price is invalid';
        flag = false;
    }
    if(!img){
        errors["img"] = 'Image is invalid';
        flag = false;
    }
    if(!flag){
        res.render('edit', {errors: errors})
    }
    else{
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
    }
}
//new
exports.handleNew = async (req, res) => {
    let title = /^[a-zA-Z ]+$/.test(req.body.title);
    let price = /[(0-9)+.?(0-9)*]+$/.test(req.body.price);
    let img = (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(req.file.filename);
    let flag = true;
    let errors = [];
    if(!title){
        errors["title"] = 'Title is invalid';
        flag = false;
    }
    if(!price){
        errors["price"] = 'Price is invalid';
        flag = false;
    }
    if(!img){
        errors["img"] = 'Image is invalid';
        flag = false;
    }
    if(!flag){
        res.render('new', {errors: errors})
    }
    else{
        let product = new Product({
            title: req.body.title,
            price:req.body.price,
            description: req.body.description,
            img:req.file.filename,
        })
        product = await product.save();
        console.log(product);
        res.redirect(`/products/${product.slug}`);
    }
}
//edit
exports.handleEdit = async (req, res) => {
    let product = await Product.findById(req.params.id);
    res.render('edit', {product: product} );
}