var fs = require('fs-extra')
var path = require('path')
var express = require('express')
var router = express.Router()

var config = require('../../config')

var getChartProperties = require('./getChartProperties')
var transformData = require('./transformData')
var thumbnail = require('./thumbnail')
var readdirectory = require('./readdirectory')

var SUPPORT_CHARTS = ['linechart', 'barchart', 'combochart', 'piechart', 'kpi', 'scatterplot', 'treemap', 'map']

// Used to cache definitions in memory to avoid file io
var CHART_CACHE = {};

function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}

function handleReq(req, res, next) {

  var appId = req.params.app
  var chartId = req.params.chart
  var filename = appId + '_' + chartId + '.json'

  getChartProperties(appId, chartId).then(function (prop) {
    // Terminate the websocket connection.
    var connections = prop[0];
    connections[0].connection.ws.terminate();
    connections[0] = null;

    if (SUPPORT_CHARTS.indexOf(prop[1].visualization) === -1) {
      return res.send('Object is not one of the supported charts: ' + SUPPORT_CHARTS.join(', '))
    }

    // Pad out the layout with snapshot related properties.
    var data = transformData(prop[1])
    data.appId = appId
    
    // Render template with the chart data
    res.render('chart', { data: data }, function (err, html) {
      res.send(html)
    });
    
    //Cache chart in memory
    CHART_CACHE[appId, chartId] = data;

    // Cache chart to disk
    fs.writeJson(path.join(config.chartCachePath, filename), data, function () {
      thumbnail(appId, chartId)
    });

  })
  .catch(function (error) {
    next(error)
  })
  .done();

}

/* GET home page. */
router.get('/', function (req, res, next) {
  readdirectory().then(function (data) {

    var data = data.map(function (d) {
      return {
        title: d.appTitle,
        appId: d.appId,
        chartId: d.chartId,
        timestamp: d.timestamp,
        visualization: d.visualization
      }
    }).reduce(function (apps, line) {
      apps[line.title] = apps[line.title] || {}
      apps[line.title].charts = apps[line.title].charts || []
      apps[line.title].charts.push(line)
      return apps;

    }, {})

    res.render('index', { data: data })

  })
});

router.get('/thumbnail/:app/:chart', nocache, function (req, res) {

  var appId = req.params.app
  var chartId = req.params.chart
  var filename = appId + '_' + chartId + '.json';

  // In-memory cache is turned off.
  if (!config.cachedefinitions) {
    fs.readJson(path.join(config.chartCachePath, filename), function (err, obj) {
      res.render('thumbnail', { data: obj })
    });
  };
  
  // Cache is turned on and chart is cached in-memory
  if (config.cachedefinitions && CHART_CACHE.hasOwnProperty(appId + chartId)) {
    res.render('thumbnail', { data: CHART_CACHE[appId + chartId] })
  } else {
    fs.readJson(path.join(config.chartCachePath, filename), function (err, obj) {
      CHART_CACHE[appId + chartId] = obj;
      res.render('thumbnail', { data: obj })
    })
  }

})

/* App but no chart, show error */
router.get('/:app', function (req, res) {
  res.send('Please specify a chart')
});


router.get('/:app/:chart/:cache*?', function (req, res, next) {

  var filename = req.params.app + '_' + req.params.chart + '.json'
  var refresh = (req.params.cache && req.params.cache === 'nocache') ? true : false

  //this is hacky...
  var waitingForRequestTofinish = false

  if (refresh) {
    waitingForRequestTofinish = true
    handleReq(req, res, next)
  };
  
  // Don't refresh chart and chart is cached in memory
  if (config.cachedefinitions && CHART_CACHE.hasOwnProperty(req.params.app + req.params.chart) && !refresh ) {
    res.render('chart', { data: CHART_CACHE[req.params.app + req.params.chart] });
  } else {
    try {
      var data = fs.readJsonSync(path.join(config.chartCachePath, filename))
    } catch (error) {
      if (error.code === 'ENOENT') {
        waitingForRequestTofinish = true
        handleReq(req, res, next)
      } else {
        next(error)
      }
    }
  };

  // Chart is already cached on disk but not in memort - serve it up to the client  
  if (!waitingForRequestTofinish && !CHART_CACHE.hasOwnProperty(req.params.app + req.params.chart)) {
    res.render('chart', { data: data })
  };

})

module.exports = router;