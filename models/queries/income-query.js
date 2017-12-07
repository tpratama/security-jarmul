"use strict";

const _ = require('lodash');
const mongoose = require('mongoose');
const Bluebird = require('bluebird');

const Income = Bluebird.promisifyAll(mongoose.model('Income'));

exports.findAllIncomesByUserId = (userId) => {
	return Bluebird.resolve()
		.then(() => {
			return Income.find({'user' : userId})
				.populate('user')
				.populate('category')
				.sort('-date');
		});
};

exports.findTotalIncomesByUserId = (userId) => {
	// This is not correct style to find sum, i want faster development
	const sumReducer = (key) => (arr) => _.reduce(arr, (res, data) => {
        return res + data[key];
    }, 0);

	return exports.findAllIncomesByUserId(userId)
		.then(sumReducer('cost'));
};

exports.getIncomeById = (id) => {
    return Income.findOne({'_id': id}).populate('user');
};

exports.removeIncomeById = (id) => {
    return Bluebird.resolve()
        .then(() => {
        return Income.findOne({'_id': id});
	})
	.then((income) => income.remove());
};

exports.updateIncomeById = (id, newExpense) => {
    const newExpensePrepared = _.pick(['cost', 'note', 'category', 'user', 'date', 'filename'], newExpense);

    return Bluebird.resolve()
        .then(() => Income.findOne({'_id': id}))
		.then((income) => _.assign(income, newExpense))
		.then((income) => expense.save());
};


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
		});
};
