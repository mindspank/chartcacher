var path = require('path')
var fs = require('fs')
var Promise = require('bluebird')
var config = require('../config')

function hostname() {
	if (config.hostfile.indexOf('cfg') > -1)
		return new Promise(function(resolve, reject) {	
			try {
				var host = fs.readFileSync( path.resolve(config.hostfile) ).toString()
				config.hostname = new Buffer(host, 'base64').toString()
				resolve(null)
			} catch (e) {
				reject(e)
			}
		})
	else {
		return new Promise(function(resolve, reject) {
			config.hostname = config.hostfile
			resolve()
		})
	}
}

module.exports = hostname