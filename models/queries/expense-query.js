const _ = require('lodash');
const mongoose = require('mongoose');
const Bluebird = require('bluebird');

const Expense = Bluebird.promisifyAll(mongoose.model('Expense'));

exports.findAllExpensesByUserId = (userId) => {
	return Bluebird.resolve()
		.then(() => {
			return Expense.find({'user' : userId})
				.populate('user')
				.populate('category')
				.sort('-date');
		})
		.then((incomes) => {
			return incomes;
		})
}

// month is 1 based from January to Descember
exports.findExpensesMonthByUserId = (userId, month) => {
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
			return Expense.find(query)
				.populate('user')
				.populate('category');
		})
		.then((expense) => {
			return expense;
		})
}
