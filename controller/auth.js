
const { check, validationResult } = require('express-validator')
const Account = require('../models/Acc');
const bcrypt = require ('bcrypt');
exports.GetRegisterPage = (req, res) => {
    res.render('register')
}

exports.PostRegister = (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        const alert = errors.array()
        res.render('register', {alert})
    }
    else{
        Account.findOne({ username: req.body.username})
        .then(data =>{
            console.log(data);
            if(data){
                let errors = {};
                if(data.username === req.body.username){
                    errors.username = "Username already exists";
                }
                res.json(errors);
            }
            else{
                let newAccount = new Account({
                    email: req.body.email,
                    username: req.body.username,
                    password: req.body.password,
                })
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newAccount.password, salt, (err, hash) => {
                        if(err) throw err;
                        newAccount.password = hash;
                        newAccount
                            .save()
                            .then(data => res.json(data))
                            .catch(err => console.error(err))
                    })
                })
            }
        })
    }
}


exports.handleLogin = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    Account.findOne({ username: username})
    .then(user =>{
        console.log(user)
        bcrypt.compare(password, user.password)
        .then((doMatch) => {
            if(doMatch){
                sess = req.session;
                sess.username = user.username
                sess.isLogin = true;
                return res.redirect('/products/home')
            }
            return res.render('index')
        })
    })
    .catch(err =>{
        res.json(err);
    })
}


exports.handleLogout = (req ,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });
}