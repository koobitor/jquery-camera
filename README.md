[jQuery Camera Plugin] - Simple camera snapshot
================================

## [Help the project](http://pledgie.com/campaigns/21928)

## Getting Started
Include jQuery and the plugin on a page. Then select a form to camera and call the `cameara` method.

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

## License
Copyright (c) 2013 Sakol Assawasagool
Licensed under the MIT license.