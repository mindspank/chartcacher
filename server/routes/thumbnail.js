var path = require('path')
var exec = require('child_process').exec
var phantomjs = require('phantomjs2-ext')
var binPath = phantomjs.path
var config = require('../../config')
var fs = require('fs-extra')
 

function thumbnail(app, chart) {
  var script = path.join(__dirname, '../../utils/rasterize.js')
  var url = 'https://' + config.hostname + ':' + config.port + '/thumbnail/' + app + '/' + chart
    
  var execpath = "\"" + binPath + "\" ";
  execpath += "\"" + script + "\" "
  execpath += "\"" + url + "\" "
  execpath += "\"" + config.thumbnailsPath.substring(0, config.thumbnailsPath.length - 1) + "\" "
  execpath += "\"" + app + "\" "
  execpath += "\"" + chart + "\" "
  execpath += "\"" + config.thumbnailSize.width + "\" "
  execpath += "\"" + config.thumbnailSize.height + "\" "

  fs.remove(path.join(config.thumbnailsPath, app + '_' + chart + '.png'), function() {
    exec(execpath, function(err) {
      if(err) return console.log(err);
    })    
  })

};

module.exports = thumbnail