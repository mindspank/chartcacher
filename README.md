## The static chart cacher service
The chartcacher will allow you to cache charts locally on the server. Users can then access those charts without having to load the entire document into memory. The module will product a interactive, but static, chart and a image that can be embedded into third party systems.
  
As users are not authenticated and does not consume tokens there is no section access or security applied to the data so beware which charts you choose to cache.


**The charts are not connected to the associative QIX engine and not meant to replace the full Qlik Sense experience.**

### Installation
Download the module from https://github.com/mindspank/chartcacher/archive/master.zip
Extract the zip file to your server, then run the copyfiles.bat file with Administrative Priviligies. Shift+Right Click the file, run as Administrator.  
The copyfiles.bat file will copy the directory to the correct place and also prevents any issues that might occur if you copy the files manually through Explorer due to long file paths.  

Next append the following block of text to the services.conf file located at  
`C:\Program Files\Qlik\Sense\ServiceDispatcher\services.conf`

```  
[chartcacher-service]
Identity=Qlik.chartcacher-service
Enabled=true
DisplayName=Static Charts
ExecType=nodejs
ExePath=Node\node.exe
Script=Node\chartcacher\index.js
    
[chartcacher-service.parameters]
```

Restart the Qlik Sense Service Dispatcher service.  
Wait 5 seconds then browse to `https://<qlik sense server name>:1337/` 

### Usage
Browsing to `https://<qlik sense server name>:1337/<app id>/<object id>` 
will automatically cache the chart locally and produce a image of the chart.
You can now link/embed this chart into your portals/intranets.
  
If you wish to refresh the cached chart simply append `/nocache` to the end of the URL.  
This will fetch a updated view of the chart from the Engine.

#### Tip
Use the Single configurator to easily find app and chart ids.  
`https://<qlik sense server name>/single`

### Folders
Chart definitions and thumbnails are located at  
`C:\Program Files\Qlik\Sense\ServiceDispatcher\Node\chartcacher\public\data`  
Clean out the chartCache and thumbnails folder if you wish to reset the service.

### Configuration
If your installation has been modified from out-the-box Sense folders then please change the config.js file accordingly.  
You can also tweak the thumbnail sizes if you want smaller/larger images.
