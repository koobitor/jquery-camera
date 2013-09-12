/**
* jQuery Camera
* ------------------------------------------
* Created by Sakol Assawasagool <http://www.koobitor.com>
*
* @license Dual licensed under the MIT or GPL Version 2 licenses
* @version 0.1.0
*/

// the semi-colon before the function invocation is a safety 
// net against concatenated scripts and/or other plugins 
// that are not closed properly.
;(function ( $, window, document, undefined ) {

  var video;
  var canvas;
  var ctx;
  var localMediaStream;
  var settings;

  // undefined is used here as the undefined global 
  // variable in ECMAScript 3 and is mutable (i.e. it can 
  // be changed by someone else). undefined isn't really 
  // being passed in so we can ensure that its value is 
  // truly undefined. In ES5, undefined can no longer be 
  // modified.
  
  // window and document are passed through as local 
  // variables rather than as globals, because this (slightly) 
  // quickens the resolution process and can be more 
  // efficiently minified (especially when both are 
  // regularly referenced in your plugin).

  // Create the defaults once
  var camera = 'camera',
      defaults = {
        resolution: "HD",
        snap: function(result) {},
        reset: function(result) {}
      };

  // The actual plugin constructor
  function Plugin( element, options ) {
      this.$element = $(element);

      // jQuery has an extend method that merges the 
      // contents of two or more objects, storing the 
      // result in the first object. The first object 
      // is generally empty because we don't want to alter 
      // the default options for future instances of the plugin
      this.options = $.extend( {}, defaults, options);

      settings = $.extend( {}, defaults, options);
      
      this._defaults = defaults;
      this._name = camera;

      this.init();
  }

  Plugin.prototype.init = function () {
    // Place initialization logic here
    // You already have access to the DOM element and
    // the options via the instance, e.g. this.$element 
    // and this.options

    plugin = this;

    var $elements = [

      $('<video>', {
        id: 'camera-video',
        autoplay: 'autoplay'
      }),

      $('<img>', {
        id: 'camera-img'
      }),

      $('<canvas>', {
        id: 'camera-canvas'
      }),

      $('<div>', {
        id: 'camera-take',
        html: $('<img>', {
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAMFBMVEUAAADp6enz8/Py8vLp6enq6urx8fH9/f34+Pjr6+v5+fn29vbx8fH5+fn29vb///9uAR3/AAAAD3RSTlMAwu3as5mB/vXUP1Fmmbdt0FhcAAABmklEQVR42u3Y227DIBBF0cNwCRfX8/9/24dUwqmwcZihlVrWa2JtJQY0AsuyLMvypQRnXrlQdAuJ24xaJxOfowwNjq85yBH3REjxHXlio4JE5PkVy3cRRhm+L2FM4Hd4jMj8njzxpVc6f5b+1uf34YZgqOIRVJmABs/afOMc1EeN81yfw1HhOUr/AJEz/Y0nF3HAcunpYuvoraTHivxsxGx42sykCBUcFZoQ2fDdph2xt6eZ8YhDm1OMeJzxapGEc0kpQrhCOhFcU4kYXDMaERx92MjRfmDk4bs/hFqvycgjW3uoDIedL4+genD1QCWO0NkhYusHJI2k0y/VD5I04m5EnDTi6+rlV3Ud+1+M6P9d81+84hLe+WhXXMKMKp5MuarHCh7NDb/JIwkHtjVXJO2jPuw22j1g5GHJrUkSR/r3GVlpWsEVVooQzpE40p8ljOKYatFmWRrpX8tGVolUvjMHiyJV6NyHiSIV+ZIB5OKJWRzpW5E/ESGegwZuB4X3gzxH/4jQv7Q1rM80bkq0bWjIwegJGcuy/EufJpgcOKWitosAAAAASUVORK5CYII='
              })
      }),

      $('<div>', {
        id: 'camera-retake',
        html: $('<img>', {
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAMFBMVEUAAADv7+/k5OTe3t7n5+f5+fnZ2dnR0dHd3d3b29vu7u7u7u7f39+0tLTa2tr///+OSmDuAAAAD3RSTlMA9uS78P64Bc6LiMtnPKTGYFoFAAAA/0lEQVR42u3a0WrEIBCFYUdzEm018/5vW1htIcWtdsfSbTn/3SD4Xaqge6rKnQ73p8oCaD8grjEi9IsgZa3RD3YjQwfBmxHRYShWBDouGY1Ske1OFYlGJGtFXLe9rnoiRJ4BKaGTb8jZra1K6JS6BnRp3UMg6OJAxIpkLEY21+mUpfniGPu3eXNpaBxQa2GMKBEiH0m8Xl722qdx+y7yUsfXhrhaup5H+/Xp4IkQIUKECBEiRIgQIUKECBEiRIgQIfJTCOzI/H8FufU+pHwrNiTX2q7+Ou4ziLU0RjargTJGThgRcROJzUCeQQpMRnBTHYLHjeRmOz0eaguH+53eAC/Z0Ft5nCI5AAAAAElFTkSuQmCC'
              })
      })
    
    ];

    this.$element
        .css("position", "relative")
        .append($elements);
    
    video = document.querySelector("video");
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");
    localMediaStream = null;

    this.$element.css({
      width: "640px",
      height: "360px",
      margin: "auto"
    });

    switch(this.options.resolution){
     
      case "GVGA":
        this.options.width = 320;
        this.options.height = 180;
        break;
   
      case "VGA":
        this.options.width = 640;
        this.options.height = 480;
        this.$element.css("height", this.options.height);
        $("#camera-img, #camera-video").css("height", this.options.height);
        break;
   
      default:
        this.options.width = 1920;
        this.options.height = 1080;
        
    }

    settings = this.options;

    canvas.width = this.options.width;
    canvas.height = this.options.height;

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if (navigator.getUserMedia) {
      navigator.getUserMedia({
        video: {
          mandatory: {
            minWidth: this.options.width,
            minHeight: this.options.height
          }
        }
      }, (function(stream) {

        var vid;
        vid = document.getElementById("camera-video");
        vid.src = window.URL.createObjectURL(stream);
        localMediaStream = stream;

      }), function(err) {
        console.log("The following error occurred when trying to use getUserMedia: " + err);
      });
    }else{
      alert("Sorry, your browser does not support getUserMedia");
    }

    // bind button
    $("#camera-take").bind("click", snap);
    $("#camera-retake").bind("click", reset);

    function snap() {
      if (localMediaStream) {
        ctx.drawImage(video, 0, 0, settings.width, settings.height);
        $("#camera-img").attr("src", canvas.toDataURL("image/webp"));
        $("#camera-img, #camera-retake").show();
        $("#camera-video, #camera-take").hide();
        settings.snap.call(undefined, canvas.toDataURL("image/webp"));
      }else{
        settings.snap.call(undefined, "can't get localMediaStream");
      }
    }

    function reset(){
      $("#camera-video, #camera-take").show();
      $("#camera-img, #camera-retake").hide();
      settings.reset.call(undefined, "rest");
    }

  };

  // A really lightweight plugin wrapper around the constructor, 
  // preventing against multiple instantiations
  $.fn[camera] = function ( options ) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + camera)) {
        $.data(this, 'plugin_' + camera, 
        new Plugin( this, options ));
      }
    });
  }

})( jQuery, window, document );
