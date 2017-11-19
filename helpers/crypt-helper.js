const aes = require('aes256');
const SECRET = 'SECRET OYE 123';

exports.encrypt = (msg, user) => {
	const dynamicSalt = user._id;
	return aes.encrypt(SECRET + dynamicSalt, msg);
};

exports.decrypt = (msg, user) => {
	const dynamicSalt = user._id;
	return aes.decrypt(SECRET + dynamicSalt, msg);
};