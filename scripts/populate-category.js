const _ = require('lodash');
const mongoose = require('mongoose');
const Bluebird = require('bluebird');
const db = require('../models/connection');

const category = Bluebird.promisifyAll(mongoose.model('Category'));

const categoryList = ['Gifts', 'Interest', 'Selling Traditional Snacks', 'Selling Batik', 'Selling Souvenir', 'Selling others', 'Others'];

Bluebird.resolve()
	.then(() => {
		console.log('start populate category.....');
	})
	.then(() => {
		const tasks = _.reduce(categoryList, (acc, categoryName) => {
			let task = category.create({
				name: categoryName
			});

			return _.concat(acc, task);
		}, []);

		return Bluebird.all(tasks);
	})
	.then(() => {
		console.log('success populate.. ');
	});
