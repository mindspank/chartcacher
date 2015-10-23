function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 5000, //< Default Max Timout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    phantom.exit(1);
                } else {
                    typeof(onReady) === "string" ? eval(onReady) : onReady();
                    clearInterval(interval);
                }
            }
        }, 400);
};

var page = require('webpage').create();
var system = require('system');
var args = system.args;

page.viewportSize = { width: args[5] || 400, height: args[6] || 300 };
page.clearMemoryCache();

page.open(args[1], function (status) {
    if (status !== "success") {
        console.log("Unable to access network");
    } else {
        waitFor(function() {
            return page.evaluate(function() {
                return !!document.querySelector('canvas')
            });
        }, function() {
            page.render(args[2] + '\\' + args[3] + '_' + args[4] + '.png');
            phantom.exit();
        });        
    }
});