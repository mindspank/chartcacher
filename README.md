## The static chart cacher service
This module will cache charts allowing you to embed static charts into third-party software such as Sharepoint and render the chart as an image to allow static offline access to Qlik Sense charts.  
The charts are non-interactive and not meant to replace the full Qlik Sense experience.

### Prerequisites
A Qlik Sense Server with internet connectivity.

### Installation
Copy this directory into  
 `C:\Program Files\Qlik\Sense\ServiceDispatcher\Node\<chartcacher>`

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
