const _ = require('lodash');
const mongoose = require('mongoose');
const Bluebird = require('bluebird');

const flashHelper = require('../../helpers/flash-helper');
const cryptHelper = require('../../helpers/crypt-helper');
const upload = require('../common/upload.js');

const Expense = Bluebird.promisifyAll(mongoose.model('Expense'));
const User = Bluebird.promisifyAll(mongoose.model('User'));

module.exports = (req, res) => {
	const userId = req.session.user._id;
	
	let expenseData = req.body;
	expenseData.user = req.session.user._id;
	
	if (_.has(req, 'files.file.path')) {
		let fileName = req.files.file.path.split('/');
		fileName = fileName[fileName.length - 1];
		expenseData.fileName = fileName;		
	}

	console.log(expenseData);
	
	return Bluebird.resolve()
		.then(() => {
			return Expense.create(expenseData);
		})
		.then(() => {
			return User.findOne({'_id': userId});
		})
		.then((user) => {
			const encryptedCurrentBalance = user.balance;
			let balance = 0;

			try{
				balance = cryptHelper.decrypt(encryptedCurrentBalance, user);	
			}
			catch(e) {
				balance = 0;
			};
			
			balance = Number(balance) - Number(expenseData.cost);
			user.balance = cryptHelper.encrypt(String(balance), user);
			req.session.user = user;
			return user.save();
		})
		.then(() => {
			req.session.serverMessage = flashHelper.createSuccessMessage('Success saving expense..');
			res.redirect('/expense');
		});
};