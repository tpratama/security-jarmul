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