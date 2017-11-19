const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	cost: Number,
	note: String,
	category: mongoose.Schema.Types.ObjectId,
	user: mongoose.Schema.Types.ObjectId,
	date: Date
});

module.exports = mongoose.model('Income', schema);
