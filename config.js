var path = require('path')
var extend = require('extend')
var fs = require('fs-extra')

var certPath = 'C:/ProgramData/Qlik/Sense/Repository/Exported Certificates/.Local Certificates'
var clientPath = 'C:/Program Files/Qlik/Sense/Client'
var chartCachePath = path.join(__dirname, 'public/data/chartCache/')
var thumbnailsPath = path.join(__dirname, 'public/data/thumbnails/')

var viewPath = path.join(__dirname, 'server/views/')
var routePath = path.join(__dirname, 'server/routes/')
var publicPath = path.join(__dirname, 'public/')

var config = extend(true, {
	
	useHttps: false,
	port: 1337,
	enginePort: 4747,
	hostfile: 'C:/ProgramData/Qlik/Sense/Host.cfg',
	engineuser: 'UserDirectory=Internal;UserId=sa_repository',
	certificates: {
		client: path.resolve(certPath, 'client.pem'),
		server: path.resolve(certPath, 'server.pem'),
		root: path.resolve(certPath, 'root.pem'),
		client_key: path.resolve(certPath, 'client_key.pem'),
		server_key: path.resolve(certPath, 'server_key.pem')
	},
	chartCachePath: chartCachePath,
	thumbnailsPath: thumbnailsPath,
	viewPath: viewPath,
	publicPath: publicPath,
	clientPath: clientPath,
	thumbnailSize: {
		width: 800,
		height: 600
	},
	cachedefinitions: true,
	/**
	 * IF RUNNING LOWER VERSION THEN 3.2 OF QLIK SENSE
	 * SET TOGGLE TO TRUE
	 */
	pre32: false
	
});


module.exports = config;