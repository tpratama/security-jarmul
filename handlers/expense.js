const _ = require('lodash');
const mongoose = require('mongoose');
const Bluebird = require('bluebird');

const category = Bluebird.promisifyAll(mongoose.model('Category'));
const User = Bluebird.promisifyAll(mongoose.model('User'));
const common = require('../helpers/common');

const cryptHelper = require('../helpers/crypt-helper');
const flashHelper = require('../helpers/flash-helper');

module.exports = (req, res) => {
	const serverMessage = flashHelper.extractServerMessage(req); 
	const userId = req.session.user._id;

	return Bluebird.resolve()
		.then(() => {
			return Bluebird.all([category.find({variant: 'EXPENSE'}), User.findOne({'_id': userId})]);
		})
		.then((results) => {
			const categories = results[0];
			const user = results[1];

			if (!categories) {
				categories = [];
			}

			const encryptedCurrentBalance = _.get(user, 'balance');
			let balance;
			try{
				balance = cryptHelper.decrypt(encryptedCurrentBalance, user);	
			}
			catch(e) {
				balance = 0;
			}

			return common.generateCommonViewData(userId)
				.then((commonViewData) => res.render('expense', _.assign({
					user: user,
					categories: categories,
					balance: balance
				}, serverMessage, commonViewData)));
		});
};