const _ = require('lodash');
const mongoose = require('mongoose');
const Bluebird = require('bluebird');

const flashHelper = require('../../helpers/flash-helper');
const cryptHelper = require('../../helpers/crypt-helper');

const Income = Bluebird.promisifyAll(mongoose.model('Income'));
const User = Bluebird.promisifyAll(mongoose.model('User'));

module.exports = (req, res) => {
	const userId = req.session.user._id;

	let incomeData = req.body;
	incomeData.user = req.session.user._id;
	
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

			console.log(balance);

			user.balance = cryptHelper.encrypt(String(balance), user);
			console.log(user.balance);
			return user.save();
		})
		.then(() => {
			req.session.serverMessage = flashHelper.createSuccessMessage('Success saving income..');
			res.redirect('/income');
		});
};