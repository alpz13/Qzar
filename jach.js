var b = require('bcrypt');
b.genSalt(10, function(err, salt) {
	b.hash('adminmatriz', salt, function(err, hash) {
		console.log(hash);
		b.compare('adminmatriz', hash, function(err, res) {
			console.log(res);
		});
	});
});
