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
	var connect = qsocks.ConnectOpenApp(engineconfig);

	return connect.then(function(connections) {
		return connections[1].getObject(chartId)
	})
	.then(function(chart) {
		return chart.getProperties().then(function(props) {
			return { chart: chart, props: props }
		})
	})
	.then(function(obj) {
		if(obj.props.visualization === 'map' && obj.props.layers[0].type === 'polygon') {
			return obj.chart.getLayout().then(function(layout) {
				return obj.chart.getHyperCubeData('/layers/0/geodata/qHyperCubeDef',props.layers[0].qHyperCubeDef.qInitialDataFetch).then(function(data) {
					layout.layers[0].geodata.qHyperCube.qDataPages = data;
					return layout;
				})	
			})
		} else {
			return obj.chart.getLayout();
		}
	})
	.then(function(layout) {
		return connect.then(function(connections) {
			return connections[1].getAppProperties().then(function(props) {
				layout.appTitle = props.qTitle
				return [connections, layout];
			})		
		})
	})
	
};

module.exports = getChartProperties;