
module.exports = (req, res) => {
	var sharedVariabel = 0;

	
	const func2 = () => {	
		for (i=0;i<1000000;i++) {
			sharedVariabel++;
		}
		console.log(sharedVariabel);
	}

	const func = () => {	
		for (i=0;i<1000000;i++) {
			sharedVariabel++;
		}
		console.log(sharedVariabel);
		setTimeout(func2, 2000);
	}

	console.log('MASUK ' + sharedVariabel);
	setTimeout(func, 2000);
	console.log('KELUAR ' + sharedVariabel);

	res.send('cek');
}