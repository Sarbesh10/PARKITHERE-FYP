const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const moment = require('moment');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

exports.register = (req, res) => {
    console.log(req.body);


    const { name, contact, email, password, passwordConfirm } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            return res.render('register', {
                message: 'Please fill the form completely'
            })
        } else if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'The passwords do not match'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);

        db.query('INSERT INTO users SET ?', { name: name, contact: contact, email: email, password: hashedPassword }, (error, results) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log(results);
                return res.render('register', {
                    message: 'User Registered'
                });
            }
        })


    })

};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).render('login', {
                message: 'Please provide a valid email and password'
            })
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {

            if (!results || !(await bcrypt.compare(password, results[0].password))) {
                res.status(401).render('login', {
                    message: "Incorrect Email or Password"
                })
            } else {
                const id = results[0].id;

                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("The token is: " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/home");
            }

        })
    }
    catch (error) {
        console.log(error);
    }
};

exports.logout = (req, res) => {
    res.render('index')
};

exports.adminregister = (req, res) => {
    console.log(req.body);

    const { name, email, password, passwordConfirm } = req.body;

    db.query('SELECT email FROM admin WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            return res.render('adminregister', {
                message: 'Please fill the form completely'
            })
        } else if (password !== passwordConfirm) {
            return res.render('adminregister', {
                message: 'The passwords do not match'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);

        db.query('INSERT INTO admin SET ?', { name: name, email: email, password: hashedPassword }, (error, results) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log(results);
                return res.render('adminregister', {
                    message: 'User Registered'
                });
            }
        })
    })

};


exports.adminlogin = async (req, res) => {
    try {
        const { name, password } = req.body;

        if (!name || !password) {
            return res.status(400).render('adminlogin', {
                message: 'Please provide a valid username and password'
            })
        }

        db.query('SELECT * FROM admin WHERE name = ?', [name], async (error, results) => {

            if (!results || !(await bcrypt.compare(password, results[0].password))) {
                res.status(401).render('adminlogin', {
                    message: "Incorrect Username or Password"
                })
            } else {
                const id = results[0].id;

                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("The token is: " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/adminpanel");
            }

        })
    }
    catch (error) {
        console.log(error);
    }
};

exports.booking = (req, res) => {

    const { registrationno, name, email, date, time, slotno } = req.body;
    let booked;
    let reminder;

    db.query("SELECT slotno, date, time FROM booking", (err, result) => {result.map((item) => {
                if (
                    item.slotno === slotno &&
                    moment(item.date).format("YYYY-MM-DD") ===
                    moment(date).format("YYYY-MM-DD") &&
                    item.time === time
                ) {
                    booked = true;
                }
            });
            if (!booked === true) {
                        
                            db.query('INSERT INTO booking SET ?', { registrationno: registrationno, name: name, email: email, date: date, time: time, slotno: slotno }, (error, results) => {
                                if (error) {
                                    console.log(error);
                                }
                                else if (!registrationno || !name || !email || !date ||!time || !slotno) {
                                    return res.status(400).render('booking', {
                                        message: 'Please fill all the fields'
                                    })
                                }
                                else {
                                    console.log(results);
                                    return res.status(400).render('booking', {
                                        message: 'Booking Confirmed'
                                    })
                                   
                                }

                            }
                            );
            } 
            else {
                res.json({
                    message:
                        "Sorry! This slot is already booked for the selected date and time",
                    type: "error",
                });
            }
        }
        );
    };
    
exports.booked = (req, res) => {
    console.log(req.body);

    const { registrationno, name, email, date, time, slotno } = req.body;

    db.query('SELECT * FROM booking', (error, results) => {
        if (error) {
            console.log(error);
        }

        else if (!registrationno || !name || !email || !date || !time || !slotno) {
            return res.render('booked', {
                message: 'Please fill the form completely'
            });
        }
        else if (date===time===slotno ) {
                alert("Can't allocate Slot. Sot no. is not availabe on the selected day and time.");
        }
    })
};



exports.adminbooking = (req, res) => {
    // console.log(req.body);

    // const { registrationno, name, email, date, time, slotno } = req.body;

    // db.query('SELECT * FROM booking', (error, results) => {
    //     if (error) {
    //         console.log(error);
    //     }

    //     else {
    //         return res.render('adminbooking', {
    //             message: 'Please fill the form completely'
    //         })
    //     }

    // })
};


exports.contactus = (req, res) => {
    const { fname, lname, email, message } = req.body;

    if (!fname || !lname || !email || !message) {
        return res.status(400).render('contactus', {
            message: 'Please fill the fields completely'
        })
    }

    db.query('INSERT INTO contactus SET ?', { fname: fname, lname: lname, email: email, message: message }, (error, results) => {

        return res.render('thankyou', {
            message: 'Booking Confirmed'
        });
    })
};



exports.profile = function(req, res){
	const {name, contact, email} = req.body;

    if (!name || !contact || !email){
				return res.status(400).render('profile', {
                    message: 'Profile Updated'

                })}
    else{
      		db.query('INSERT INTO profile SET ?', {name: name, contact: contact, email: email}, (error, results) =>{
                return res.render('profile', {
                                  
                              })
                          })
          }
        }

exports.eprofile = function(req, res){

};

exports.receipt = function(req, res){
    db.query('SELECT name, registrationno, slotno, date, time from booking', (error, results) => {
        if (error) {
            console.log(error);
        }
        else{
            return res.render('receipt', {
                data: results
            })
        }
    })
};

exports.schedule = function(req, res){
    db.query('SELECT * from booking where email=hari18@gmail.com', (error, results) => {
        if (error) {
            console.log(error);
        }
        else{
            return res.render('schedule', {
                data: results
            })
        }
    })
};

exports.admincontactus = function(req, res){
    db.query('SELECT * from contactus', (error, rows) => {
        if (error) {
            console.log(error);
        }
        else{
            return res.render('admincontactus', {
                results: results
            })
        }
    })
};
