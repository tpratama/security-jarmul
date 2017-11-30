const _ = require('lodash');
const mongoose = require('mongoose');
const Bluebird = require('bluebird');

const income = Bluebird.promisifyAll(mongoose.model('Income'));
const User = Bluebird.promisifyAll(mongoose.model('User'));

const cryptHelper = require('../helpers/crypt-helper');
const flashHelper = require('../helpers/flash-helper');

module.exports = (req, res) => {
	const serverMessage = flashHelper.extractServerMessage(req); 
	const userId = req.session.user._id;
	const tipe = ['income', 'expense'];

	return Bluebird.resolve()
				   .then(function(){
				   		return Bluebird.all([income.find(), User.findOne({'_id':userId})]);
				   })
				   .spread(function(income, user){
				   	res.json(income);
				   })


	//return res.j('Hello');
	// return Bluebird.resolve()
	// 	.then(() => {
	// 		return Bluebird.all([category.find(), User.findOne({'_id': userId})]);
	// 	})
	// 	.then((results) => {
	// 		const categories = results[0];
	// 		const user = results[1];

	// 		if (!categories) {
	// 			categories = [];
	// 		}

	// 		const encryptedCurrentBalance = _.get(user, 'balance');
	// 		console.log(encryptedCurrentBalance);
	// 		let balance;
	// 		try{
	// 			balance = cryptHelper.decrypt(encryptedCurrentBalance, user);	
	// 		}
	// 		catch(e) {
	// 			balance = 0;
	// 		}

	// 		console.log(balance);
	// 		return res.render('income', _.assign({
	// 			user: user,
	// 			categories: categories,
	// 			balance: balance
	// 		}, serverMessage));
	// 	});
};