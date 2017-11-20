const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	cost: { type: Number, default: 0},
	note: String,
	category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	date: { type: Date, default: Date.now },
	fileName: String
});

module.exports = mongoose.model('Income', schema);
