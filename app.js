const e = require("express");
const express = require("express");
const exphbs = require('express-handlebars');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');

const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });


dotenv.config({ path: './.env' });

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

//Connect public folder for css
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

//Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));

//Parse JSON bodues (as sent by API client)
app.use(express.json());

//Parse cookies
app.use(cookieParser());

app.set('view engine', 'hbs');

//Test
db.connect((error) => {
    if (error) {
        console.log(error)
    }
    else {
        console.log("mysql connected")
    }
})

//Define Router
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));


app.listen(3000, () => {
    console.log("Server started on port 3000");
})