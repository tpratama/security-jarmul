const _ = require('lodash');
const mongoose = require('mongoose');
const Bluebird = require('bluebird');

const category = Bluebird.promisifyAll(mongoose.model('Category'));
const User = Bluebird.promisifyAll(mongoose.model('User'));
const query = require('../models/queries/income-query');
const common = require('../helpers/common');

const cryptHelper = require('../helpers/crypt-helper');
const flashHelper = require('../helpers/flash-helper');

module.exports = (req, res) => {
    const serverMessage = flashHelper.extractServerMessage(req);
    const userId = req.session.user._id;
    const incomeId = req.query.id;

    return Bluebird.resolve()
        .then(() => {
            return Bluebird.props({
                categories: category.find({variant: 'INCOME'}),
                user: User.findOne({'_id': userId})
            });
        })
        .then((result) => {
            const categories = result.categories;
            const user = result.user;

            const encryptedCurrentBalance = _.get(user, 'balance');
            let balance;
            try{
                balance = cryptHelper.decrypt(encryptedCurrentBalance, user);
            }
            catch(e) {
                balance = 0;
            }

            return query.getIncomeById(incomeId)
                .then((income) => {
                    return common.generateCommonViewData(userId)
                        .then((commonViewData) => {
                            return res.render('income-edit', _.assign({
                                user: user,
                                categories: categories,
                                balance: balance,
                                total: totalIncome,
                                id: incomeId,
                                formFilling: income
                            }, serverMessage, commonViewData));
                        });
                });
        });
};