const _ = require('lodash');
const mongoose = require('mongoose');
const Bluebird = require('bluebird');

const Income = Bluebird.promisifyAll(mongoose.model('Income'));

exports.findAllIncomesByUserId = (userId) => {
	return Bluebird.resolve()
		.then(() => {
			return Income.find({'user' : userId})
				.populate('user')
				.populate('category');
		})
		.then((incomes) => {
			return incomes;
		})
}

// month is 1 based from January to Descember
exports.findIncomesMonthByUserId = (userId, month) => {
	const targetMonth = month - 1;

	const currentDate = Date();
	const startDate = new Date(currentDate.getFullYear(), targetMonth);
	const endDate = startDate.setMonth(startDate.getMonth() + 1);

	const query = {
		date: {
			$gte: startDate,
			$lt: endDate
		},
		user: userId
	};

	return Bluebird.resolve()
		.then(() => {
			return Income.find(query)
				.populate('user')
				.populate('category');
		})
		.then((incomes) => {
			return incomes;
		})
}
