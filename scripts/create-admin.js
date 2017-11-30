const _ = require('lodash');
const mongoose = require('mongoose');
const Bluebird = require('bluebird');
const db = require('../models/connection');

const authHelper = require('../helpers/auth-helper');
const User = Bluebird.promisifyAll(mongoose.model('User'));

function runner(username, password) {
    return Bluebird.resolve()
        .then(() => {
            return User.createAsync({
                name: 'ADMIN',
                username: username,
                password: authHelper.hash(password),
                isAdmin: true
            });
        })
        .then(() => User.findOne({username: username}))
        .then((newUser) => {
            newUser.balance = cryptHelper.encrypt('0', newUser);
            return newUser.save();
        })
        .finally(() => console.log('OK user: '+username+' pass: '+password))
        .catch(() => console.log('ADMIN sudah ada'));
}

runner('TESTING', 'DICOBA');