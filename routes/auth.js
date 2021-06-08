const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

router.post("/register", authController.register );

router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.post('/contactus', authController.contactus);

router.post('/adminlogin', authController.adminlogin);

router.post('/adminregister', authController.adminregister);

router.post('/adminbooking', authController.adminregister);

router.post('/booking', authController.booking);

router.post('/booked', authController.booked);

router.post('/profile', authController.profile);

router.post('/eprofile', authController.eprofile);

module.exports = router;