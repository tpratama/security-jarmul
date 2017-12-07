'use strict';

const Bluebird = require('bluebird');
const incomeQuery = require('../models/queries/income-query');
const expenseQuery = require('../models/queries/expense-query');

exports.generateCommonViewData = (userId) => {
    return Bluebird.props({
        totalIncome: incomeQuery.findTotalIncomesByUserId(userId),
        totalExpense: expenseQuery.findTotalExpensesByUserId(userId)
    });
}