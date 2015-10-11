/* ============================================================
 * Pages Header Plugin
 * ============================================================ */

(function($) {
  'use strict';

  var Header = function(element, options) {
    this.$body = $('body');
    this.$element = $(element);
    this.options = $.extend(true, {}, $.fn.header.defaults, options);
    if (this.$element.attr('data-pages-header') == "autoresize")
      this.options.autoresize = true

    if (this.$element.attr('data-pages-header') != null)
      this.options.minimizedClass = this.options.minimizedClass + ' ' + this.$element.attr('data-pages-resize-class');

    this.initAffix();
  }
  Header.prototype.initAffix = function() {
    if (this.$element.attr('data-pages-autofixed') == "true") {
      this.$element.affix({
        offset: {
          top: this.$element.offset().top,
        }
      });
    }
  };
  Header.prototype.updateAffix = function() {
    if (this.$element.attr('data-pages-autofixed') == "true") {
      console.log(this.$element.offset().top)
      this.$element.removeData('affix').removeClass('affix affix-top affix-bottom');
      this.$element.affix({
        offset: this.$element.offset().top
      })
    }
  };
  Header.prototype.addMinimized = function() {
    if (this.options.autoresize && !this.$element.hasClass('affix-top'))
      if (!this.$element.hasClass(this.options.minimizedClass))
        this.$element.addClass(this.options.minimizedClass);
  };
  Header.prototype.removeMinized = function() {
    if (this.options.autoresize || this.$element.hasClass('affix-top'))
      this.$element.removeClass(this.options.minimizedClass);
  };

  function Plugin(option) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data('pg.header');
      var options = typeof option == 'object' && option;

      if (!data) $this.data('pg.header', (data = new Header(this, options)));
      if (typeof option == 'string') data[option]();
    })
  }

  var old = $.fn.header

  $.fn.header = Plugin
  $.fn.header.Constructor = Header


  $.fn.header.defaults = {
    duration: 350,
    autoresize: false,
    minimizedClass: 'minimized'
  }

  // HEADER NO CONFLICT
  // ====================

  $.fn.header.noConflict = function() {
    $.fn.header = old;
    return this;
  }

  // HEADER DATA API
  //===================
  $(document).ready(function() {
    $('.menu > li > a').on('mouseenter click', function(e) {
      if ($(this).parent().hasClass('mega')) {
        if ($(this).parent().hasClass('open')) {
          $(this).parents('.container').removeClass('clip-mega-menu');
        } else {
          $(this).parents('.container').addClass('clip-mega-menu');
        }

      } else {
        $(this).parents('.container').removeClass('clip-mega-menu');


      }
      $(this).parent().toggleClass('open').siblings().removeClass('open');

    });
    // $('.menu > li > nav').on('mouseenter mouseleave click', function () {
    //     var el = $(this).parent();
    //     if(!el.hasClass('open'))
    //         el.addClass('open');
    //     else
    //         el.removeClass('open');
    // })

    $('.desktop .menu > li > nav').on('mouseleave', function(e) {
      $('.menu > li').removeClass('open');
    });
  })

  $(window).on('load', function() {
    $('[data-pages="header"]').each(function() {
      var $header = $(this)
      $header.header($header.data())
    })
  });

  $('[data-pages="header-toggle"]').on('click touchstart', function(e) {
    e.preventDefault();
    var el = $(this)

    var header = el.attr('data-pages-element');
    $('body').toggleClass('menu-opened');
    $('[data-pages="header-toggle"]').toggleClass('on');

  });
  $(window).on("resize", function() {
    $('[data-pages="header"]').header('updateAffix');
  })
  $(window).on("scroll", function() {
    var ScrollTop = parseInt($(window).scrollTop());
    if (ScrollTop > 1) {
      $('[data-pages="header"]').header('addMinimized');
    } else {
      if (ScrollTop < 10) {
        $('[data-pages="header"]').header('removeMinized');
      }
    }
  });

})(window.jQuery);
