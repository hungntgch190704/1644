const flash = require('connect-flash');
const multer = require('multer');

exports.validateInput = (req,res, next) => {
    let name = /^[a-zA-Z ]+$/.test(req.body.title);
    if(!name){
        req.flash('message', 'Name is invalid!!');
        return res.redirect('/products/edit/' + req.params.id);
    }
    let price = /[(0-9)+.?(0-9)*]+$/.test(req.body.price);
    if(!price){
        req.flash('message', 'Price is invalid!!');
        return res.redirect('/products/edit/' + req.params.id);
    }

    let img = (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(req.file.filename);
    if(!img){
        req.flash('message', 'img is invalid!!');
        return res.redirect('/products/edit/' + req.params.id);
    }
    next();
}