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
			return connections.chart = chart;
		})
		.then(function(chart) {
			return connections.chart.getProperties()
		})
	    .then(function(props) {
			if(props.visualization === 'map' && props.layers[0].type === 'polygon') {
				return connections.chart.getLayout().then(function(layout) {
					return connections.chart.getHyperCubeData('/layers/0/geodata/qHyperCubeDef',props.layers[0].qHyperCubeDef.qInitialDataFetch).then(function(data) {
						layout.layers[0].geodata.qHyperCube.qDataPages = data;
						return layout;
					})	
				})
			} else {
				return connections.chart.getLayout();
			}
		})
		.then(function(layout) {
			return connections.app.getAppProperties().then(function(props) {
				layout.appTitle = props.qTitle
				return layout;
			})	
		})
		.then(function(layout) {
			return [connections, layout];
		})
	
};

module.exports = getChartProperties;