var transformData = function(data) {

	data.snapshotData = {
	content: {      
		chartData: {
		legendScrollOffset: 0,
		scrollOffset: 0,
		discreteSpacing: 0,
		axisInnerOffset: 0,
		rotation: 0
			}
	},
	object: {
		size: {}
	}
	};
	
	data.timestamp = Date.now();
	data.chartId = data.qInfo.qId
	
	delete data.qInfo
	
	return data;

};

module.exports = transformData;