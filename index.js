'use strict';
const _ = require('lodash');
const exphbs = require('exphbs');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Bluebird = require('bluebird');
const session = require('express-session');
const db = require('./models/connection');
const expenseQuery = require('./models/queries/expense-query');
const incomeQuery = require('./models/queries/income-query');


const cryptHelper = require('./helpers/crypt-helper');


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
	if (req.session.tryCount>3) return res.redirect('/home');
	
	if (req.session.user) return next();
	res.redirect('/home');
}

const adminOnly = (req, res, next) => {
	var isAdmin = _.get(req.session.user, 'isAdmin', '');
	if (isAdmin) next();

	res.redirect('/home');
};

const incomeUserMiddleware = (req, res, next) => {
    var incomeId = req.query.id;
    console.log(incomeId);

    return incomeQuery.getIncomeById(incomeId)
		.then((income) => {
			if(income.user.username !== req.session.user.username) {
				res.redirect('/income/report');
			}
			else next();
		});
};

const expenseUserMiddleware = (req, res, next) => {
    var expenseId = req.query.id;
	return expenseQuery.getExpenseById(expenseId)
		.then((expense) => {
    		console.log(expense.user.username);
			if(expense.user.username !== req.session.user.username) {
				res.redirect('/expense/report');
			}
			else next();
		});
};


app.get('/', require('./handlers/home'));
app.get('/home', require('./handlers/home'));
app.get('/income', authMiddleware, require('./handlers/income'));
app.get('/expense', authMiddleware, require('./handlers/expense'));
app.get('/download', authMiddleware, require('./handlers/common/download'));
app.get('/income/report', authMiddleware, require('./handlers/income-report'));
app.get('/expense/report', authMiddleware, require('./handlers/expense-report'));
app.get('/income/edit', authMiddleware, incomeUserMiddleware, require('./handlers/income-edit'));
app.get('/expense/edit', authMiddleware, expenseUserMiddleware, require('./handlers/expense-edit'));
app.post('/income/post/edit', authMiddleware, require('./handlers/common/upload'), require('./handlers/income/edit'));
app.post('/expense/post/edit', authMiddleware, require('./handlers/common/upload'), require('./handlers/expense/edit'));

app.get('/logout', authMiddleware, (req, res) => {
	req.session.destroy();
	res.redirect('/home');
});

app.post('/home/register', require('./handlers/user/register'));
app.post('/home/login', require('./handlers/user/login'));
app.post('/income/create', authMiddleware, require('./handlers/common/upload'), require('./handlers/income/create'));
app.post('/expense/create', authMiddleware, require('./handlers/common/upload'), require('./handlers/expense/create'));
app.post('/income/delete', authMiddleware, require('./handlers/income/delete'));
app.post('/expense/delete', authMiddleware, require('./handlers/expense/delete'));


app.listen(3000, () => console.log('Server dijalankan pada port 3000'));
