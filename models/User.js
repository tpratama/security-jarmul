const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	name: String,
	username: {
		type: String,
		index: {
			unique: true
		}
	},
	password: String
});

module.exports = mongoose.model('User', schema);
