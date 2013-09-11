[jQuery Camera Plugin] - Simple camera snapshot using HTML5! By 7republic.com
================================

The jQuery Camera Plugin provides a snapshot camera for your application. You can set resolution eg. "HD", "VGA", "QVGA".

## [Help the project](http://pledgie.com/campaigns/21928)

[![Help the project](http://www.pledgie.com/campaigns/21928.png?skin_name=chrome)](http://pledgie.com/campaigns/21928)

This project is looking for help! [You can donate to the ongoing pledgie campaign](http://pledgie.com/campaigns/21928)
and help spread the word. If you've used the plugin, or plan to use, consider a donation - any amount will help.

## Getting Started
Include jQuery and the plugin on a page. Then select a form to camera and call the `cameara` method.
You must run this on localhost or web server.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>jQuery Camera</title>
    <link href="jquery.camera.css" media="all" rel="stylesheet" type="text/css" />
  </head>
  <body>
    <div id="camera"></div>
    <script src="http://code.jquery.com/jquery-1.4.4.min.js"></script>
    <script src="jquery.camera.js"></script>
    <script>
      $(document).ready(function(){
        $("#camera").camera({
          resolution: "QVGA", // "QVGA", "VGA", "HD"
          snap: function(result){
            console.log(result);
          },
          reset: function(result){
            console.log(result);
          },
        });
      });
    </script>
  </body>
</html>
```

## Reporting an Issue

1. Make sure the problem you're addressing is reproducible.
2. Use http://jsbin.com or http://jsfiddle.net to provide a test page.
3. What version of the plug-in is the issue reproducible in. Is it reproducible after updating to the latest version.

## License
Copyright (c) 2013 Sakol Assawasagool
Licensed under the MIT license.
