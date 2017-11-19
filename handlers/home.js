const _ = require('lodash');
const flashHelper = require('../helpers/flash-helper');

module.exports = (req, res) => {
	const serverMessage = flashHelper.extractServerMessage(req);
	
	res.render('home', serverMessage);
};