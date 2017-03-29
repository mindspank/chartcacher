var express = require('express')
var config = require('../config')
var path = require('path')
var Promise = require('bluebird')

var certificates = require('../utils/certificates')
var hostname = require('../utils/hostname')

module.exports = {	
	start: function() {
		
		Promise.all([certificates(), hostname()]).then(function() {

			var app = express()
			
			app.set('port', config.port)
			app.set('views', config.viewPath)
			app.set('view engine', 'jade')

			app.use(function(req, res, next) {
				if(req.url === '/resources/assets/object-renderer/object-renderer.js' && config.pre30) {
					res.sendFile(path.join(__dirname, '../public/assets/object-renderer/object-renderer.js'))
				} else {
					next()
				}
			})

			app.use(require('less-middleware')( config.publicPath ))
			app.use(express.static( config.publicPath ))
			
			app.use('/resources', express.static(config.clientPath) )
			app.use('/fonts', express.static(path.resolve(config.clientPath, 'fonts')) )
			app.use('/', require('./routes/index') )

			// catch 404 and forward to error handler
			app.use(function(req, res, next) {
				var err = new Error('Not Found')
				err.status = 404
				next(err)
			})
			
			app.use(function(err, req, res, next) {
				res.status(err.status || 500)
				res.render('error', {
					message: err.message,
					error: err
				});
			});
			
			if (config.useHttps) {
				require('https').createServer({
					ca: [config.certificates.root],
					cert: config.certificates.server,
					key: config.certificates.server_key,
					rejectUnauthorized: false,
					requireCertificate: false
				}, app).listen(config.port, config.hostname)
			} else {
				require('http').createServer(app).listen(config.port, config.hostname)
			}
						
		})
		.catch((err) => {
			console.log(err)
		})
		
	}	
}