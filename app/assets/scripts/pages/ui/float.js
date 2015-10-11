/* ============================================================
 * Pages Float Plugin
 * ============================================================ */

(function($) {
  'use strict';
  // FLOAT CLASS DEFINITION
  // ======================

  var Float = function(element, options) {
    this.$element = $(element);
    this.options = $.extend(true, {}, $.fn.pgFloat.defaults, options);

    var _this = this;
    var _prevY;

    function update() {
      var element = _this.$element;
      var w = $(window).scrollTop();
      var translateY = (w - element.offset().top) * _this.options.speed;
      var delay = _this.options.delay / 1000; //in seconds
      var curve = _this.options.curve;
      var maxTopTranslate = _this.options.maxTopTranslate;
      var maxBottomTranslate = _this.options.maxBottomTranslate;

      if (maxTopTranslate == 0) {
        if (element.offset().top + element.outerHeight() < w) return;
      }

      if (maxBottomTranslate == 0) {
        if (element.offset().top > w + $(window).height()) return;
      }

      if (_prevY < translateY) { // scroll down, element will hide from top
        if (maxTopTranslate != 0 && Math.abs(translateY) > maxTopTranslate) return;
      } else {
        if (maxBottomTranslate != 0 && Math.abs(translateY) > maxBottomTranslate) return;
      }


      element.css({
        'transition': 'transform ' + delay + 's ' + curve,
        'transform': 'translateY(' + translateY + 'px)',
      });

      _prevY = translateY;
    }

    $(window).bind('scroll', function() {
      update()
    });
    $(window).bind('load', function() {
      update()
    });
  }
  Float.VERSION = "1.0.0";



  // FLOAT PLUGIN DEFINITION
  // =======================
  function Plugin(option) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data('pgFloat');
      var options = typeof option == 'object' && option;

      if (!data) $this.data('pgFloat', (data = new Float(this, options)));
      if (typeof option == 'string') data[option]();
    })
  }

  var old = $.fn.pgFloat;

  $.fn.pgFloat = Plugin;
  $.fn.pgFloat.Constructor = Float;


  $.fn.pgFloat.defaults = {
    topMargin: 0,
    bottomMargin: 0,
    speed: 0.1,
    delay: 1000,
    curve: 'ease'
  }

  // FLOAT NO CONFLICT
  // ====================

  $.fn.pgFloat.noConflict = function() {
    $.fn.pgFloat = old;
    return this;
  }

  // FLOAT DATA API
  //===================

  $(window).on('load', function() {

    $('[data-pages="float"]').each(function() {
      var $pgFloat = $(this)
      $pgFloat.pgFloat($pgFloat.data())
    })
  });

})(window.jQuery);
