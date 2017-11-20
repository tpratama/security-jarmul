const _ = require('lodash');
const mongoose = require('mongoose');
const Bluebird = require('bluebird');

const flashHelper = require('../../helpers/flash-helper');
const cryptHelper = require('../../helpers/crypt-helper');
const upload = require('../common/upload.js');

const Income = Bluebird.promisifyAll(mongoose.model('Income'));
const User = Bluebird.promisifyAll(mongoose.model('User'));

module.exports = (req, res) => {
	const userId = req.session.user._id;
	
	let incomeData = req.body;
	incomeData.user = req.session.user._id;
	
	if (_.has(req, 'files.file.path')) {
		let fileName = req.files.file.path.split('/');
		fileName = fileName[fileName.length - 1];
		incomeData.fileName = fileName;		
	}

	console.log(incomeData);
	
	return Bluebird.resolve()
		.then(() => {
			return Income.create(incomeData);
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
			
			balance = Number(balance) + Number(incomeData.cost);
			user.balance = cryptHelper.encrypt(String(balance), user);
			return user.save();
		})
		.then(() => {
			req.session.serverMessage = flashHelper.createSuccessMessage('Success saving income..');
			res.redirect('/income');
		});
};