const _ = require('lodash');
/*
Create message object for serverMessage
@return Object
*/

exports.createSuccessMessage = (msg) => {
	return {
		type: 'success',
		message: msg
	};
};

exports.createErrorMessage = (msg) => {
	return {
		type: 'error',
		message: msg
	};
};

exports.extractServerMessage = (req) => {
	const type = _.get(req.session, 'serverMessage.type', '');
	const message = _.get(req.session, 'serverMessage.message', '');

	let viewData = {};

	if (req.session.serverMessage) {
		viewData[type] = true;
		viewData.serverMessage = message;
		
		req.session.serverMessage = null;
	}

	return viewData;
}