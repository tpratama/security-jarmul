const _ = require('lodash');
const mongoose = require('mongoose');
const Bluebird = require('bluebird');

const query = require('../models/queries/expense-query'); 

const cryptHelper = require('../helpers/crypt-helper');
const flashHelper = require('../helpers/flash-helper');

module.exports = (req, res) => {
	const userId = req.session.user._id;

	const user = req.session.user;
	const encryptedCurrentBalance = _.get(user, 'balance');
	
	return query.findAllExpensesByUserId(userId)
		.then((expenses) => {
			const viewData = _.map(expenses, (expense) => {
				let data = _.pick(expense, ['_id', 'cost', 'category', 'date', 'note', 'fileName']);
			    data.editLink = '/expense/edit?id=' + expense._id;
    			data.date = new Date(expense.date).toLocaleDateString('id-ID');
				data.category = data.category.name;
				data.deleteLink = '/expense/delete';
				if (data.fileName) {
					data.link = '/download?file=' + data.fileName;
				}

				return data;
			});

			console.log(viewData);

			return Bluebird.all([cryptHelper.decrypt(encryptedCurrentBalance, user), viewData]);
		})
		.spread((balance, viewData) => res.render('report', {
			reports: viewData,
			title: 'Expense Report',
			user: user,
			balance: balance,
			expense: true
		}));
}
