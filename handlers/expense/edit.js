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

    console.log(req.body);
    var expenseData = _.omit(req.body, ['id'])   ;
    expenseData.user = req.session.user._id;

    if (_.has(req, 'files.file.path')) {
        let fileName = req.files.file.path.split('/');
        fileName = fileName[fileName.length - 1];
        expenseData.fileName = fileName;
    }
    console.log('aaaaaaaaaaa', expenseData);
    return Bluebird.resolve()
        .then(() => Bluebird.all(
        [expenseQuery.getExpenseById(expenseId),
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

    console.log(expenseData);
    balance = Number(balance) + Number(oldData.cost) - Number(expenseData.cost);
    user.balance = cryptHelper.encrypt(String(balance), user);
    req.session.user = user;

    _.assign(oldData, expenseData);
    return Bluebird.all([user.save(), oldData.save()]);
})
.then(() => {
        req.session.serverMessage = flashHelper.createSuccessMessage('Success saving expense..');
    res.redirect('/expense/report');
});
};