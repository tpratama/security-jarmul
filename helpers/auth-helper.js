const md5 = require('md5');
const SALT = 'SECRET OYE';

/*
Melakukan hash dari plain text
@return String
*/
exports.hash = (plainText) => {
	return md5(plainText + SALT);
};

/*
Melakukan cek apakah plainText dan hashedText sama
@return true / false
*/
exports.isEqual = (plainText, hashedText) => {
	return (md5(plainText + SALT) == hashedText);
};