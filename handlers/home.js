const _ = require('lodash');

module.exports = (req, res) => {
	const type = _.get(req.session, 'serverMessage.type', '');
	const message = _.get(req.session, 'serverMessage.message', '');

	let viewData = {};

	if (req.session.serverMessage) {
		viewData[type] = true;
		viewData.serverMessage = message;
	}
	
	req.session.serverMessage = null;
	res.render('home', viewData);
};