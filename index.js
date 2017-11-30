'use strict';

const exphbs = require('exphbs');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Bluebird = require('bluebird');
const session = require('express-session');

const cryptHelper = require('./helpers/crypt-helper');
const db = require('./models/connection');

const app = express();

global.__basedir = __dirname;

//Memakai handlebars sebagai templating engine
app.engine('hbs', exphbs);
app.set('view engine', 'hbs');

var publicPath = path.resolve(__dirname, 'build');
app.use(express.static(publicPath));
app.use(session({
	secret: 'jarmul security',
	cookie: {
		maxAge: 24*60*60
	},
	saveUninitialized: true,
	resave: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//middleware catch unauthorize user
//bounce if not logged in
const authMiddleware = (req, res, next) => {
	if (req.session.user) return next();
	res.redirect('/home');
}

app.get('/', require('./handlers/home'));
app.get('/home', require('./handlers/home'));
app.get('/income', authMiddleware, require('./handlers/income'));
app.get('/expense', authMiddleware, require('./handlers/expense'));
app.get('/download', authMiddleware, require('./handlers/common/download'));
app.get('/income/report', authMiddleware, require('./handlers/income-report'));
app.get('/expense/report', authMiddleware, require('./handlers/expense-report'));

app.get('/logout', authMiddleware, (req, res) => {
	req.session.destroy();
	res.redirect('/home');
});

app.post('/home/register', require('./handlers/user/register'));
app.post('/home/login', require('./handlers/user/login'));
app.post('/income/create', authMiddleware, require('./handlers/common/upload'), require('./handlers/income/create'));
app.post('/expense/create', authMiddleware, require('./handlers/common/upload'), require('./handlers/expense/create'));

app.listen(3000, () => console.log('Server dijalankan pada port 3000'));
