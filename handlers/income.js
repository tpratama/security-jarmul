module.exports = (req, res) => {
	res.render('income', {
		user: req.session.user
	});
};