var qsocks = require('qsocks')
var config = require('../../config')

var getChartProperties = function(appId, chartId) {
	
	var engineconfig = {
		host: config.hostname,
		port: config.enginePort,
		isSecure: true,
		appname: appId,
		headers: {
			'X-Qlik-User': config.engineuser
		},
		key: config.certificates.client_key,
		cert: config.certificates.client,
		rejectUnauthorized: false
	}
		
	var connections = {}
	return qsocks.Connect(engineconfig)
		.then(function(global) {
			return connections.global = global
		})
		.then(function() {
			return connections.global.openDoc(appId)
		})
		.then(function(app) {
			return connections.app = app
		})
		.then(function() {
			return connections.app.getObject(chartId)
		})
		.then(function(chart) {
			return chart.getLayout()
		})
	    .then(function(layout) {
			return connections.app.getAppProperties().then(function(props) {
				layout.appTitle = props.qTitle
				return layout
			})
		})
		.then(function(layout) {
			return [connections, layout]
		})
	
};

module.exports = getChartProperties;