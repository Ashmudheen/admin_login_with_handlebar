const express = require('express');
const Users = require('../models/Users').User;
const admin = require('../models/Users').admin;
const session = require('express-session');
const router = express.Router();





const protectadmin = (req,res,next) =>{
    if(!req.session.emailid){
        res.redirect('/admin/admin');
    }else{
        next();
    }
}

const ridirecttoadminDashboard = (req, res, next) => {
    if (req.session.emailid) {
        res.redirect('/admin/admindashboard');
    } else {
        next();
    }
}

router.get('/admin', ridirecttoadminDashboard,(req, res) => {
    res.render('adminlogin',{title :'Admin login' });
})
router.get('/admindashboard', protectadmin, (req, res) => {
    Users.find({}).lean()
        .exec((err, data) => {
            res.render('admindashboard', { users: data ,title :'Admin Page'});
        })
})

router.post('/admin', (req, res) => {
    const { email, password } = admin;
    if(req.body.name == email && req.body.password == password){
        req.session.emailid = req.body.name;
        res.redirect('/admin/admindashboard');
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
        res.redirect("/admin/admindashboard");
    })
})

router.delete('/deleteuser', (req, res) => {
    const email = req.body.email;
    Users.deleteOne({ email: email }, (err) => {
        if (err) throw err;
        res.redirect("/admin/admindashboard");
    })
})

router.post('/adminlogout', (req, res) => {
    req.session.destroy();
    res.clearCookie("admin");
    res.redirect("/admin/admin");
})


module.exports = router;