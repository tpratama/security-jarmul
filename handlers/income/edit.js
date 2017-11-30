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

    console.log(req.body);
    var incomeData = _.omit(req.body, ['id'])   ;
    incomeData.user = req.session.user._id;

    if (_.has(req, 'files.file.path')) {
        let fileName = req.files.file.path.split('/');
        fileName = fileName[fileName.length - 1];
        incomeData.fileName = fileName;
    }
    console.log('aaaaaaaaaaa', incomeData);
    return Bluebird.resolve()
        .then(() => Bluebird.all(
        [incomeQuery.getIncomeById(incomeId),
            User.findOne({'_id': userId})
        ]))
        .spread((oldData, user) => {
            const encryptedCurrentBalance = user.balance;
            let balance = 0;

            try{
                balance = cryptHelper.decrypt(encryptedCurrentBalance, user);
            }
            catch(e) {
                balance = 0;
            };

            console.log(incomeData);
            balance = Number(balance) - Number(oldData.cost) + Number(incomeData.cost);
            user.balance = cryptHelper.encrypt(String(balance), user);
            req.session.user = user;

            _.assign(oldData, incomeData);
            return Bluebird.all([user.save(), oldData.save()]);
        })
        .then(() => {
            req.session.serverMessage = flashHelper.createSuccessMessage('Success saving income..');
            res.redirect('/income/report');
        });
};