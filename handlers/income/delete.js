const _ = require('lodash');
const mongoose = require('mongoose');
const Bluebird = require('bluebird');

const incomeQuery = require('../../models/queries/income-query');
const flashHelper = require('../../helpers/flash-helper');
const cryptHelper = require('../../helpers/crypt-helper');
const upload = require('../common/upload.js');

const Income = Bluebird.promisifyAll(mongoose.model('Income'));
const User = Bluebird.promisifyAll(mongoose.model('User'));

module.exports = (req, res) => {
    const userId = req.session.user._id;
    const incomeId = req.body.id;

    return Bluebird.resolve()
        .then(() => Bluebird.all(
            [incomeQuery.getIncomeById(incomeId),
             User.findOne({'_id': userId})
            ]))
        .spread((incomeData, user) => {
            console.log('asdasd', user);
            const encryptedCurrentBalance = user.balance;
            let balance = 0;

            try{
                balance = cryptHelper.decrypt(encryptedCurrentBalance, user);
            }
            catch(e) {
                balance = 0;
            };

            balance = Number(balance) - Number(incomeData.cost);
            user.balance = cryptHelper.encrypt(String(balance), user);
            req.session.user = user;
            return user.save();
        })
        .then(() => incomeQuery.removeIncomeById(incomeId))
        .then(() => {
            req.session.serverMessage = flashHelper.createSuccessMessage('Success saving income..');
            res.redirect('/income');
        });
};