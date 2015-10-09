var fs = require('fs');

var exists = function(file) {

	if ( !fs.existsSync( file ) || !fs.lstatSync( file ).isFile() ) {
		return false;
	};
	
	return true;
	
};

module.exports = exists;