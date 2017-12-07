const _ = require('lodash');
const mongoose = require('mongoose');
const Bluebird = require('bluebird');

const query = require('../models/queries/income-query'); 
const common = require('../helpers/common');

const cryptHelper = require('../helpers/crypt-helper');
const flashHelper = require('../helpers/flash-helper');

module.exports = (req, res) => {
    const userId = req.session.user._id;

    const user = req.session.user;
    const encryptedCurrentBalance = _.get(user, 'balance');

    return query.findAllIncomesByUserId(userId)
        .then((incomes) => {
            const viewData = _.map(incomes, (income) => {
                let data = _.pick(income, ['_id', 'cost', 'category', 'date', 'note', 'fileName']);
                data.editLink = '/income/edit?id=' + income._id;
                data.deleteLink = '/income/delete';
                if (data.date) data.date = new Date(income.date).toLocaleDateString('id-ID');
                if (data.category) data.category = data.category.name;

                if (data.fileName) {
                    data.link = '/download?file=' + data.fileName;
                }

                return data;
            });
            return Bluebird.all([cryptHelper.decrypt(encryptedCurrentBalance, user), viewData]);
        })
        .spread((balance, viewData) => {
			return common.generateCommonViewData(userId)
				.then((commonViewData) => {
                    return res.render('report', _.assign({
                        reports: viewData,
                        title: 'Incomes Report',
                        user: user,
                        balance: balance,
                        income: true
                    }, commonViewData	));
				});
		});
}
