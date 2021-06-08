const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs-login'
});

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

connection.connect(function(err){
    if(err) throw err;
    console.log('connected');
})


router.get("/", (req, res) =>{
    res.render("index");
});

router.get("/register", (req, res) =>{
    res.render("register");
});

router.get("/login", (req, res) =>{
    res.render("login");
});

router.get("/logout", (req, res) =>{
    res.render("index");
});

router.get("/adminpanel", (req, res) =>{
    res.render("adminpanel");
});

router.get("/adminregister", (req, res) =>{
    res.render("adminregister");
});

router.get("/adminlogin", (req, res) =>{
    res.render("adminlogin");
});

router.get("/home", (req, res) =>{
    res.render("home");
});

router.get("/smartventures", (req, res) =>{
    res.render("smartventures");
});

router.get("/booking", (req, res) =>{
    res.render("booking");
});

router.get("/booked", (req, res) =>{
    res.render("booked");
});

router.get("/schedule", (req, res) =>{
    var scdulquery = 'select * from booking where id=18';
    connection.query(scdulquery, function(err, rows, fields){
    res.render("schedule", { title: 'Schedule', scdul: rows});
});
});

router.get("/menu", (req, res) =>{
    res.render("menu");
});

router.get("/contactus", (req, res) =>{
    res.render("contactus");
});

router.get("/thankyou", (req, res) =>{
    res.render("thankyou");
});

router.get("/loyaltypoints", (req, res) =>{
    res.render("loyaltypoints");
});

router.get("/review", (req, res) =>{
    res.render("review");
});

router.get("/receipt", (req, res) => {
    var rcptquery = 'select * from booking where id=18';
    connection.query(rcptquery, function(err, rows, fields){
    
    res.render("receipt", { title: 'Receipt', rcpt: rows })
});
});

router.get("/term&condition", (req, res) =>{
    res.render("term&condition");
});

router.get("/privacy", (req, res) =>{
    res.render("privacy");
});

router.get("/adminbooking", (req, res) =>{
    var adbknquery = 'select * from booking';
    connection.query(adbknquery, function(err, rows, fields){
    res.render("adminbooking",{ title: 'Admin Booking', adbkn: rows });
});
});

router.get("/admincontactus", (req, res) =>{
    var adcnctquery = 'select * from contactus';
    connection.query(adcnctquery, function(err, rows, fields){
    res.render("admincontactus",{ title: 'Admin Contact', adcnct: rows });
});
});

router.get("/adminloyaltypoints", (req, res) =>{
    res.render("adminloyaltypoints");
});

router.get("/profile", (req, res) =>{
    var prflquery = 'select * from users where id = 8';
    connection.query(prflquery, function(err, rows, fields){
    res.render("profile",{ title: 'Profile', prfl: rows });
});
});

router.get("/eprofile", (req, res) =>{
    var updtquery = 'select * from users where id = 8';
    connection.query(updtquery, function(err, rows, fields){
    res.render("eprofile",{title:'Update Profile', updt: rows });
})
});

router.post('/eprofile/:id', function(req, res, next) {
    var name = req.body.name;
    var contact = req.body.contact;
    var email = req.body.email;
    var id = req.params.id;
    var updt = `UPDATE users SET name="${name}", contact="${contact}", email="${email}" WHERE id=${id}`;
  
    db.query(updt, function(err, result) {
      if (err) throw err;
      console.log('record updated!');
      res.redirect('/profile');
    });
  });

module.exports = router;