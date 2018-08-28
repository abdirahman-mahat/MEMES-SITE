/*jslint indent:2, browser:true */
// Simple JavaScript slideshow.
// No frameworks, no Flash, no bleeding-edge browser needed.
//
// I wrote this because I needed a slideshow that was pure JavaScript and
// had a feature to stop after looping N times.
//
// Example usage:
// var show = new SlideShow("http://www.example.com/base/path/to/images",
//   ["array.png","of.png","slides.png"], width, height);
// document.write(show.getHTML());
// show.run();
//
// Uses DIVs with IDs of slideshow, current and next. Search and replace if
// you need to change that.
var SlideShow = (function () {
  "use strict";
  var setImage, slideIn, resetSlider, SlideShow;

  setImage = function (id, newimg) {
    var obj = document.getElementById(id), img = obj.firstChild;
    if (img) {
      obj.replaceChild(newimg, img);
    } else {
      obj.appendChild(newimg);
    }
  };

  // Start X, delta X, delay in ms, callback for when done
  slideIn = function (sx, dx, ms, callback) {
    var x = sx, obj = document.getElementById("next"), step = function () {
      x -= dx;
      if (x < 0) {
        x = 0;
      }
      obj.style.left = x + "px";
      if (x > 0) {
        x -= dx;
        setTimeout(step, ms);
      } else {
        callback();
      }
    };
    setTimeout(step, ms);
  };

  resetSlider = function (x) {
    var obj = document.getElementById("next");
    if (obj) {
      obj.style.left = x + "px";
    }
  };

  SlideShow = function (basepath, slides, width, height) {
    var i, img, loop;
    this.width = width;
    this.height = height;
    this.images = [];
    this.pause = 3000;
    this.delay = 10;
    this.deltax = 10;
    // Insert slideshow HTML
    // Preload images
    for (i = 0; i < slides.length; i += 1) {
      img = new Image();
      img.src = basepath + slides[i];
      this.images[this.images.length] = img;
    }
    // Loop N times
    for (loop = 0; loop < 3; loop += 1) {
      for (i = 0; i < slides.length; i += 1) {
        this.images[this.images.length] = this.images[i];
      }
    }
  };

  SlideShow.prototype.getHTML = function () {
    return '<div id="slideshow" style="width: ' + this.width + 'px; height: ' + this.height + 'px;"><div id="current"><p>Loading</p></div><div id="next"><p>Loading</p></div></div>';
  };

  SlideShow.prototype.run = function () {
    var curidx = 0, my = this, advance = function () {
      curidx += 1;
      var cur = my.images[curidx], nxt = my.images[curidx + 1];
      if (nxt) {
        slideIn(my.width, my.deltax, my.delay, function () {
          setImage("current", cur);
          resetSlider(my.width);
          if (nxt) {
            setImage("next", nxt);
          }
        });
        setTimeout(advance, my.pause);
      }
    };
    resetSlider(this.width);
    setImage("current", this.images[0]);
    setImage("next", this.images[1]);
    setTimeout(advance, this.pause);
  };

  return SlideShow;
}());
