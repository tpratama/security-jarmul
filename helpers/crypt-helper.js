const _ = require('lodash');
const aes = require('aes256');
const Bluebird = require('bluebird');
const encryptor = Bluebird.promisifyAll(require('node-cipher'));

const SECRET = 'SECRET OYE 123';

exports.encrypt = (msg, user) => {
	const dynamicSalt = user._id;
	return aes.encrypt(SECRET + dynamicSalt, msg);
};

exports.decrypt = (msg, user) => {
	const dynamicSalt = user._id;
	return aes.decrypt(SECRET + dynamicSalt, msg);
};

exports.encryptFile = (filePath, user) => {
	const dynamicSalt = user._id;
	return Bluebird.resolve()
		.then(() => {
			const [path, ext] = filePath.split('.');
			
			return encryptor.encryptAsync({
				input:filePath, 
				output: path + '.' + ext + '.dat',
				password: SECRET + dynamicSalt
			});
		});
}

exports.decryptFile = (filePath, user) => {
	const dynamicSalt = user._id;
	return Bluebird.resolve()
		.then(() => {
			const [path, ext, ext2] = filePath.split('.');
			
			return encryptor.decryptAsync({
				input:filePath, 
				output: path + '.' + ext,
				password: SECRET + dynamicSalt
			});
		});
}