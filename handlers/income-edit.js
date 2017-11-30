const _ = require('lodash');
const mongoose = require('mongoose');
const Bluebird = require('bluebird');

const category = Bluebird.promisifyAll(mongoose.model('Category'));
const User = Bluebird.promisifyAll(mongoose.model('User'));
const query = require('../models/queries/income-query');

const cryptHelper = require('../helpers/crypt-helper');
const flashHelper = require('../helpers/flash-helper');

module.exports = (req, res) => {
    const serverMessage = flashHelper.extractServerMessage(req);
    const userId = req.session.user._id;
    const incomeId = req.query.id;

    return Bluebird.resolve()
        .then(() => {
        return Bluebird.all([category.find({variant: 'INCOME'}), User.findOne({'_id': userId})]);
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

        return query.getIncomeById(incomeId)
            .then((income) => {
                return res.render('income-edit', _.assign({
                    user: user,
                    categories: categories,
                    balance: balance,
                    id: incomeId,
                    formFilling: income
                }, serverMessage));
            });
    });
};