const _ = require('lodash');
const mongoose = require('mongoose');
const Bluebird = require('bluebird');

const expenseQuery = require('../../models/queries/expense-query');
const flashHelper = require('../../helpers/flash-helper');
const cryptHelper = require('../../helpers/crypt-helper');
const upload = require('../common/upload.js');

const Expense = Bluebird.promisifyAll(mongoose.model('Expense'));
const User = Bluebird.promisifyAll(mongoose.model('User'));

module.exports = (req, res) => {
    const userId = req.session.user._id;
    const expenseId = req.body.id;

    return Bluebird.resolve()
        .then(() => Bluebird.all([expenseQuery.getExpenseById(expenseId), User.findOne({'_id': userId})]))
        .spread((expenseData, user) => {
            const encryptedCurrentBalance = user.balance;
            let balance = 0;

            try{
                balance = cryptHelper.decrypt(encryptedCurrentBalance, user);
            }
            catch(e) {
                balance = 0;
            };

            balance = Number(balance) + Number(expenseData.cost);
            user.balance = cryptHelper.encrypt(String(balance), user);
            req.session.user = user;
            return user.save();
        })
        .then(() => expenseQuery.removeExpenseById(expenseId))
        .then(() => {
            req.session.serverMessage = flashHelper.createSuccessMessage('Success deleting expense..');
            res.redirect('/expense');
        });
};