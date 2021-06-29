
const { check, validationResult } = require('express-validator')
const Account = require('../models/Acc');
const bcrypt = require ('bcrypt');
exports.GetRegisterPage = (req, res) => {
    res.render('register')
}

exports.PostRegister = (req, res) => {
    // const errors = validationResult(req)
    // if(!errors.isEmpty()) {
    //     const alert = errors.array()
    //     res.render('register', {alert})
    // }
    let errors = [];
    let email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email);
    let username = /^[a-zA-Z0-9]+$/.test(req.body.username);
    let password = req.body.password;
    let flag = true;
    if(!email){
        errors["email"] = 'Email is invalid';
        flag = false;
    }
    if (req.body.username.length<3){
        console.log('dit me m');
        errors["username"] = 'Username must be 3+ characters';
        flag = false;
    }
    else if(!username){
        errors["username"] = 'Username is invalid';
        flag = false;
    }
    if(password.length<6){
        errors["password"] = 'Password must be 6+ characters';
        flag=false;
    }
    if(!flag){
        res.render('register', {errors: errors})
    }
    else{
        Account.findOne({ username: req.body.username})
        .then(data =>{
            console.log(data);
            if(data){
                
                if(data.username === req.body.username){
                    errors.username = "Username already exists";
                }
                res.render('register', {errors : errors});
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
                            .save();
                    })
                })
                res.render('index');
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
            return res.render('index', {errors: 'Username or password is incorrect'})
            //return res.json('anh duong sai roi');
        })
    })
    .catch(err =>{
        res.redirect('/', {errors: 'Username or password is incorrect'});
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