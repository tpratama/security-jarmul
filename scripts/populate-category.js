const _ = require('lodash');
const mongoose = require('mongoose');
const Bluebird = require('bluebird');
const db = require('../models/connection');

const category = Bluebird.promisifyAll(mongoose.model('Category'));

const incomeList = ['Gifts', 'Interest', 'Selling Traditional Snacks', 'Selling Batik', 'Selling Souvenir', 'Selling others', 'Others'];
const expenseList = ['Restock', 'Food', 'Giving Salary', 'Others', 'Shopping', 'Personal Use'];

Bluebird.resolve()
	.then(() => {
		console.log('start populate category.....');
	})
	.then(() => {
		const tasksIncome = _.reduce(incomeList, (acc, categoryName) => {
			let task = category.create({
				name: categoryName,
				variant: 'INCOME'
			});

			return _.concat(acc, task);
		}, []);

		const tasksExpense = _.reduce(expenseList, (acc, categoryName) => {
			let task = category.create({
				name: categoryName,
				variant: 'EXPENSE'
			});

			return _.concat(acc, task);
		}, []);

		return Bluebird.all(_.concat(tasksIncome, tasksExpense));
	})
	.then(() => {
		console.log('success populate.. ');
	});
