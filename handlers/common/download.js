const _ = require('lodash');
const fs = require('fs');
const Bluebird = require('bluebird');
const flashHelper = require('../../helpers/flash-helper');
const cryptHelper = require('../../helpers/crypt-helper');

module.exports = (req, res) => {
	const fileName = _.get(req, 'query.file', '');
	const filePath = __basedir + '/uploads/' + fileName;
	const encryptFilePath = filePath  + '.dat';

	console.log(encryptFilePath);
	console.log(filePath);

	Bluebird.resolve()
		.then(() => {
			return fs.existsSync(encryptFilePath);
		})
		.then((isValid) => {
			if (!isValid) {
				const error = new Error('File is not valid!');
				error.name = 'File not valid';

				throw error;
			}

			return cryptHelper.decryptFile(encryptFilePath, req.session.user);
		})
		.then(() => {
			return res.sendFile(filePath)
		})
		.then(() => cryptHelper.encryptFile(filePath, req.session.user))
		.then(() => fs.unlink(filePath)) // delete decrypted file afterward
		.catch((err) => {
			req.session.serverMessage = flashHelper.createErrorMessage('Error! ' + err.name);
			res.redirect('/income');
		});
}