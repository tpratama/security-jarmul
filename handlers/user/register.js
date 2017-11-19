const _ = require('lodash');
const mongoose = require('mongoose');
const Bluebird = require('bluebird');
const md5 = require('md5');
const authHelper = require('../../helpers/auth-helper');
const flashHelper = require('../../helpers/flash-helper');

const user = Bluebird.promisifyAll(mongoose.model('User'));


module.exports = (req, res) => {
	console.log(req.body);

	const name = _.get(req.body, 'name');
	const username = _.get(req.body, 'username');
	const password = _.get(req.body, 'password');

	return Bluebird.resolve()
		.then(() => {
			if (_.includes([name, username, password], '')) {
				throw Error('Data tidak valid');
			}
		})
		.then(() => {
			return user.createAsync({
				name: name,
				username: username,
				password: authHelper.hash(password)
			});
		}).then(() => {
			req.session.serverMessage = flashHelper.createSuccessMessage(`Halo ${name}, anda berhasil mendaftarkan diri!`);
			return res.redirect('/home');
		})
		.catch((error) => {
			req.session.serverMessage = flashHelper.createErrorMessage(error.message);
			return res.redirect('/home');
		});
};