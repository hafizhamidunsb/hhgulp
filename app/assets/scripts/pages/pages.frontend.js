(function($) {

  'use strict';

  var Pages = function() {
    this.VERSION = "1.0.0";
    this.AUTHOR = "Revox";
    this.SUPPORT = "support@revox.io";

    this.pageScrollElement = 'html, body';
    this.$body = $('body');

    this.setUserOS();
    this.setUserAgent();
  }

  // Set environment vars
  Pages.prototype.setUserOS = function() {
    var OSName = "";
    if (navigator.appVersion.indexOf("Win") != -1) OSName = "windows";
    if (navigator.appVersion.indexOf("Mac") != -1) OSName = "mac";
    if (navigator.appVersion.indexOf("X11") != -1) OSName = "unix";
    if (navigator.appVersion.indexOf("Linux") != -1) OSName = "linux";

    this.$body.addClass(OSName);
  }

  Pages.prototype.setUserAgent = function() {
    if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
      this.$body.addClass('mobile');
    } else {
      this.$body.addClass('desktop');
      if (navigator.userAgent.match(/MSIE 9.0/)) {
        this.$body.addClass('ie9');
      }
    }
  }

  // Pages util functions
  Pages.prototype.isVisibleXs = function() {
    (!$('#pg-visible-xs').length) && this.$body.append('<div id="pg-visible-xs" class="visible-xs" />');
    return $('#pg-visible-xs').is(':visible');
  }

  Pages.prototype.isVisibleSm = function() {
    (!$('#pg-visible-sm').length) && this.$body.append('<div id="pg-visible-sm" class="visible-sm" />');
    return $('#pg-visible-sm').is(':visible');
  }

  Pages.prototype.isVisibleMd = function() {
    (!$('#pg-visible-md').length) && this.$body.append('<div id="pg-visible-md" class="visible-md" />');
    return $('#pg-visible-md').is(':visible');
  }

  Pages.prototype.isVisibleLg = function() {
    (!$('#pg-visible-lg').length) && this.$body.append('<div id="pg-visible-lg" class="visible-lg" />');
    return $('#pg-visible-lg').is(':visible');
  }

  Pages.prototype.getUserAgent = function() {
    return $('body').hasClass('mobile') ? "mobile" : "desktop";
  }

  Pages.prototype.setFullScreen = function(element) {
    // Supports most browsers and their versions.
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullscreen;

    if (requestMethod) { // Native full screen.
      requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
      var wscript = new ActiveXObject("WScript.Shell");
      if (wscript !== null) {
        wscript.SendKeys("{F11}");
      }
    }
  }

  Pages.prototype.getColor = function(color, opacity) {
    opacity = parseFloat(opacity) || 1;

    var elem = $('.pg-colors').length ? $('.pg-colors') : $('<div class="pg-colors"></div>').appendTo('body');

    var colorElem = elem.find('[data-color="' + color + '"]').length ? elem.find('[data-color="' + color + '"]') : $('<div class="bg-' + color + '" data-color="' + color + '"></div>').appendTo(elem);

    var color = colorElem.css('background-color');

    var rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    var rgba = "rgba(" + rgb[1] + ", " + rgb[2] + ", " + rgb[3] + ', ' + opacity + ')';

    return rgba;
  }

  Pages.prototype.setBackgroundImage = function() {
    $('[data-pages-bg-image]').each(function() {
      var _elem = $(this)
      var defaults = {
        pagesBgImage: "",
        lazyLoad: 'true',
        progressType: '',
        progressColor: '',
        bgOverlay: '',
        bgOverlayClass: '',
        overlayOpacity: 0,
      }
      var data = _elem.data();
      $.extend(defaults, data);
      var url = defaults.pagesBgImage;
      var color = defaults.bgOverlay;
      var opacity = defaults.overlayOpacity;

      var overlay = $('<div class="bg-overlay"></div>');
      overlay.addClass(defaults.bgOverlayClass);
      overlay.css({
        'background-color': color,
        'opacity': 1
      });
      _elem.append(overlay);

      var img = new Image();
      img.src = url;
      img.onload = function() {
        _elem.css({
          'background-image': 'url(' + url + ')'
        });
        _elem.children('.bg-overlay').css({
          'opacity': opacity
        });
      }

    })
  }
  Pages.prototype.initRevealFooter = function() {
    var _elem = $('[data-pages="reveal-footer"]');
    setHeight();

    function setHeight() {
      var h = _elem.outerHeight();
      _elem.prev().css({
        'margin-bottom': h
      })
    }
    $(window).resize(function() {
      setHeight();
    })
  }
  Pages.prototype.initFormGroupDefault = function() {
    $('.form-group.form-group-default').click(function() {
      $(this).find('input').focus();
    });
    $('body').on('focus', '.form-group.form-group-default :input', function() {
      $('.form-group.form-group-default').removeClass('focused');
      $(this).parents('.form-group').addClass('focused');
    });

    $('body').on('blur', '.form-group.form-group-default :input', function() {
      $(this).parents('.form-group').removeClass('focused');
      if ($(this).val()) {
        $(this).closest('.form-group').find('label').addClass('fade');
      } else {
        $(this).closest('.form-group').find('label').removeClass('fade');
      }
    });

    $('.form-group.form-group-default .checkbox, .form-group.form-group-default .radio').hover(function() {
      $(this).parents('.form-group').addClass('focused');
    }, function() {
      $(this).parents('.form-group').removeClass('focused');
    });
  }
  Pages.prototype.initTextRotator = function() {
    var defaults = {
      animation: "flipUp",
      separator: ",",
      speed: 2000
    }
    $('[data-pages-init="text-rotate"]').each(function() {
      defaults = $.extend({}, defaults, $(this).data());
      if (!$.fn.textrotator) return;
      $(this).textrotator(defaults);
    });
  }
  Pages.prototype.initAnimatables = function() {
    if (!$.fn.appear) return;
    $('[data-pages-animate="number"]').appear();
    $('[data-pages-animate="progressbar"]').appear();
    $('[data-pages-animate="number"]').on('appear', function() {
      $(this).animateNumbers($(this).attr("data-value"), true, parseInt($(this).attr("data-animation-duration")));
    });
    $('[data-pages-animate="progressbar"]').on('appear', function() {
      $(this).css('width', $(this).attr("data-percentage"));
    });
  }

  Pages.prototype.initAutoImageScroller = function() {
    //Scrolling Device Image : Showcase
    $('[data-pages="auto-scroll"]').each(function() {
      var y = 0;
      var interval;
      var Screen = $(this).find('.iphone-border');
      var img = Screen.find('img');
      var endOfImage = false;
      var scroll = function() {
        var screenHeight = Screen.height();
        var swipeDistance = screenHeight / 2;

        if (y - swipeDistance <= -img.height() + screenHeight) {
          y = -img.height() + screenHeight;
          endOfImage = true;
        } else {
          y -= swipeDistance;
        }
        img.css({
          'transform': 'translateY(' + y + 'px)'
        });
        if (endOfImage) {
          y = 0;
          clearInterval(interval);
          setTimeout(function() {
            img.css({
              'transform': 'translateY(' + y + 'px)'
            });
            endOfImage = false;
            interval = setInterval(scroll, 1000);
          }, 2000);
        }
      }
      interval = setInterval(scroll, 1000);
    })
  }

  Pages.prototype.initUnveilPlugin = function() {
    // lazy load retina images
    $.fn.unveil && $("img").unveil();
  }

  // Call initializers
  Pages.prototype.init = function() {
    this.setBackgroundImage();
    this.initFormGroupDefault();
    this.initUnveilPlugin();
    this.initAnimatables();
    this.initAutoImageScroller();
    this.initTextRotator();
    this.initRevealFooter();
  }

  $.Pages = new Pages();
  $.Pages.Constructor = Pages;

})(window.jQuery);
