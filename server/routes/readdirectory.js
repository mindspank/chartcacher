var fs=require('fs-extra');
var config = require('../../config')
var Promise = require('bluebird')
var path = require('path')
var fsp = Promise.promisifyAll(fs)

function readdirectory() {  
    return fsp.readdirAsync(config.chartCachePath)
        .then(function(files) {
            return Promise.all(files.filter(function(file) { return file.split('.').pop() === 'json'; })
            .map(function(file) {
                return fsp.readJsonAsync( path.join(config.chartCachePath, file) )
            },[]))
        })
}
        
module.exports = readdirectory;