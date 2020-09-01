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

const protectadmin = (req,res,next) =>{
    if(!req.session.emailid){
        res.redirect('/admin');
    }else{
        next();
    }
}

const ridirecttoadminDashboard = (req, res, next) => {
    if (req.session.emailid) {
        res.redirect('/admindashboard');
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

router.get('/admin', ridirecttoadminDashboard,(req, res) => {
    res.render('adminlogin',{title :'Admin login' });
})
router.get('/admindashboard', protectadmin, (req, res) => {
    Users.find({}).lean()
        .exec((err, data) => {
            res.render('admindashboard', { users: data ,title :'Admin Page'});
        })
})

//post methods

router.post('/admin', (req, res) => {
    const { email, password } = admin;
    if(req.body.name == email && req.body.password == password){
        req.session.emailid = req.body.name;
        res.redirect('/admindashboard');
    }else{
        const msg = 'Invalid username or Password';
        res.render('adminlogin', { msg });
    }
})
router.post('/useredit', (req, res) => {
    const email = req.body.email;
    Users.findOne({ email: email }).lean()
        .exec((err, data) => {
            res.render('adminedit', { user: data });
        })
})

router.put('/usereditsave', (req, res) => {
    const { id, email, name, password } = req.body;
    const data = {
        id,
        email,
        name,
        password
    }
    
    Users.updateOne({ id: id }, data, (err, docs) => {
        
        
        if (err) throw err;
        res.redirect("/admindashboard");
    })
})

router.delete('/deleteuser', (req, res) => {
    const email = req.body.email;
    Users.deleteOne({ email: email }, (err) => {
        if (err) throw err;
        res.redirect("/admindashboard");
    })
})

router.post('/adminlogout', (req, res) => {
    req.session.destroy();
    res.clearCookie("sid");
    res.redirect("/login");
})

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
            res.render('login', { msg });
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
