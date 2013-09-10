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
      this.element = element;

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
    // the options via the instance, e.g. this.element 
    // and this.options

    plugin = this;

    $(this.element).append("<video id='camera-video' autoplay></video>");
    $(this.element).append("<img id='camera-img' />");
    $(this.element).append("<canvas id='camera-canvas' ></canvas>");
    $(this.element).append("<div id='camera-take' ><img src='data:image/png;base64,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' /></div>");
    $(this.element).append("<div id='camera-retake' ><img src='data:image/png;base64,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' /></div>");
    $(this.element).css("position","relative");

    video = document.querySelector("video");
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");
    localMediaStream = null;

    $(this.element).css({
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
        $(this.element).css("height", this.options.height);
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