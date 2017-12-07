const _ = require('lodash');
const mongoose = require('mongoose');
const Bluebird = require('bluebird');
const authHelper = require('../../helpers/auth-helper');
const flashHelper = require('../../helpers/flash-helper');

const user = Bluebird.promisifyAll(mongoose.model('User'));

module.exports = (req, res) => {
	const username = _.get(req.body, 'username', '');
	const password = _.get(req.body, 'password', '');

	return Bluebird.resolve()
		.then(() => user.findOne({username: username}))
		.then((user) => {
			if (!user) {
				throw Error('User not found');
			}

			const hashedPassword = user.password;
			return [authHelper.isEqual(password, hashedPassword), user];
		})
		.spread((status, user) => {
			if (status == false) {

				if (!_.has(req.session, 'tryCount')) req.session.tryCount = 0;
				else req.session.tryCount+=1;

				console.log(req.session.tryCount);
				if (req.session.tryCount > 3) {
					throw Error('Your session blocked! Please try again later...');
				}
				else throw Error('Wrong password');
			}

			//set user is logged in
			req.session.user = user;
			res.redirect('/income');
		})
		.catch((error) => {
			req.session.serverMessage = flashHelper.createErrorMessage(error.message);
			res.redirect('/home');
		})
}