/* ============================================================
 * Pages Parallax Plugin
 * ============================================================ */

(function($) {
  'use strict';
  // PARALLAX CLASS DEFINITION
  // ======================

  var Parallax = function(element, options) {
    this.$element = $(element);
    this.$body = $('body');
    this.options = $.extend(true, {}, $.fn.parallax.defaults, options);
    this.$coverPhoto = this.$element.find('.cover-photo');
    // TODO: rename .inner to .page-cover-content
    this.$content = this.$element.find('.inner');

    // this.$element.css('transition', 'all 100ms');
    // this.$coverPhoto.css('transition', 'all 100ms');
    // this.$content.css('transition', 'all 100ms');

    // if cover photo img is found make it a background-image
    if (this.$coverPhoto.find('> img').length) {
      var img = this.$coverPhoto.find('> img');
      this.$coverPhoto.css('background-image', 'url(' + img.attr('src') + ')');
      img.remove();
    }
    this.translateBgImage();
  }
  Parallax.VERSION = "1.0.0";

  Parallax.prototype.animate = function(translate) {

    var scrollPos;
    var pagecoverHeight = this.$element.height();
    //opactiy to text starts at 50% scroll length
    var opacityKeyFrame = pagecoverHeight * 50 / 100;
    var direction = 'translateX';

    scrollPos = $(window).scrollTop();
    if (this.$body.hasClass('mobile')) {
      scrollPos = -(translate);
    }
    direction = 'translateY';

    this.$coverPhoto.css({
      'transform': direction + '(' + scrollPos * this.options.speed.coverPhoto + 'px)'
    });

    this.$content.css({
      'transform': direction + '(' + scrollPos * this.options.speed.content + 'px)',
    });

    this.translateBgImage();
  }

  Parallax.prototype.translateBgImage = function() {
      var scrollPos = $(window).scrollTop();
      var pagecoverHeight = this.$element.height();
      if (this.$element.attr('data-pages-bg-image')) {
        var relativePos = this.$element.offset().top - scrollPos;

        // if element is in visible window's frame
        if (relativePos > -pagecoverHeight && relativePos <= $(window).height()) {
          var displacePerc = 100 - ($(window).height() - relativePos) / ($(window).height() + pagecoverHeight) * 100;
          this.$element.css({
            'background-position': 'center ' + displacePerc + '%'
          });
        }
      }
    }
    // PARALLAX PLUGIN DEFINITION
    // =======================
  function Plugin(option) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data('pg.parallax');
      var options = typeof option == 'object' && option;

      if (!data) $this.data('pg.parallax', (data = new Parallax(this, options)));
      if (typeof option == 'string') data[option]();
    })
  }

  var old = $.fn.parallax

  $.fn.parallax = Plugin
  $.fn.parallax.Constructor = Parallax


  $.fn.parallax.defaults = {
    speed: {
      coverPhoto: 0.3,
      content: 0.17
      // coverPhoto: 0.5,
      // content: 0.3
    }
  }

  // PARALLAX NO CONFLICT
  // ====================

  $.fn.parallax.noConflict = function() {
    $.fn.parallax = old;
    return this;
  }

  // PARALLAX DATA API
  //===================

  $(window).on('load', function() {

    $('[data-pages="parallax"]').each(function() {
      var $parallax = $(this)
      $parallax.parallax($parallax.data())
    })
  });

  $(window).on('scroll', function() {
    // Disable parallax for Touch devices

    $('[data-pages="parallax"]').parallax('animate');
  });

})(window.jQuery);
