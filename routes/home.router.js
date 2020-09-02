const express = require('express');
const Users = require('../models/Users').User;
const admin = require('../models/Users').admin;
const session = require('express-session');
const router = express.Router();



const ridirecttoDashboard = (req, res, next) => {
    if (req.session.userid) {
        res.redirect('/dashboard');
    } else {
        next();
    }
}

const protectHome = (req, res, next) => {
    if (!req.session.userid) {
        res.redirect('/login');
    } else {
        next();
    }
}




router.get('/', ridirecttoDashboard, (req, res) => {
    res.redirect('/login');
});

router.get('/dashboard', protectHome, (req, res) => {
    const username = req.session.userid;
    res.render('dashboard', { username ,title : username});
});

router.get('/login', ridirecttoDashboard, (req, res) => {
    res.render('login',{title :'User login'});
});

router.get('/register', ridirecttoDashboard, (req, res) => {
    res.render('register',{title :'Register User'});
});


//post methods


router.post('/register', (req, res) => {
    const newUser = {
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    }
    // Users.push(newUser);
    var newman = new Users(newUser);
    newman.save();
    res.redirect('/login');
});

router.post('/login', (req, res) => {
    const name = req.body.name;
    const password = req.body.password;

    Users.findOne({ name: name, password: password }, (err, user) => {
        if (!user) {
            const msg = 'Invalid Username or Password';
            res.render('login', { msg,name:name,password:password });
        } else {
            req.session.userid = user.name;
            res.redirect('/dashboard');
        }
    })
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('dashboard');
        }
        res.clearCookie('sid');
        res.redirect('/');
    })
});

module.exports = router;
