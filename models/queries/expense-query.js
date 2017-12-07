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
};

exports.getExpenseById = (id) => {
	return Expense.findOne({'_id': id}).populate('user');
};

exports.findTotalExpensesByUserId = (userId) => {
    // This is not correct style to find sum, i want faster development
    const sumReducer = (key) => (arr) => _.reduce(arr, (res, data) => {
        return res + data[key];
    }, 0);

    return exports.findAllExpensesByUserId(userId)
        .then(sumReducer('cost'));
};

exports.removeExpenseById = (id) => {
	return Bluebird.resolve()
		.then(() => {
			return Expense.findOne({'_id': id});
		})
		.then((expense) => expense.remove());
};

exports.updateExpenseById = (id, newExpense) => {
	const newExpensePrepared = _.pick(['cost', 'note', 'category', 'user', 'date', 'filename'], newExpense);

	return Bluebird.resolve()
		.then(() => Expense.findOne({'_id': id}))
		.then((expense) => _.assign(expense, newExpense))
		.then((expense) => expense.save());
};

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
