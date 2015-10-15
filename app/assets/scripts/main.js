!function($) {
  'use strict';

  var SITE = function() {
    this.VERSION = "1.0.0";
    this.Pages = $.Pages;
  };

  SITE.prototype.initSlabtext = function() {
    fontSpy('LeagueGothic', {
      success: function () {
        $('[data-slabtext]').slabText();
      }
    });
  }

  SITE.prototype.initMisc = function() {

    // SET ACTIVE CLASS
    $('.menu a').each(function() {
      var link = $(this).attr('href').replace(/^\/+|\/+$/g, "").replace(/\//g, "_").replace(/\.html$/, '');
      if ($(this).data('body')) {
        link = $(this).data('body');
      }

      if ($('body').hasClass(link)) {
        $(this).addClass('active');
      }
    });

    // MOBILE MENU OVERLAY
    var $menuOverlay = $('<div class="menu-overlay"/>').appendTo($('.header'));
    $menuOverlay.click(function(e) {
      e.preventDefault();
      $('body').toggleClass('menu-opened');
      $('[data-pages="header-toggle"]').toggleClass('on');
    });

    $('[data-fitvids]').fitVids();

    // $('body:not(.mobile)').find('h1, h2, h3, h4, h5, h6, p').filter(':not(.no-orphan)').unorphanize();
    $('body:not(.mobile)').find('p').filter(':not(.no-orphan)').unorphanize();
    $('body:not(.mobile) .orphan').unorphanize();

    $('[data-bullet]').each(function () {
      var bullet = $(this).data('bullet');
      $(this).find('li').each(function () {
        $(this).prepend('<i class="' + bullet + '"></i>');
      });
    });

    $('.social-icon i[class^=icon-]').each(function() {
      $(this).clone().addClass($(this).attr('class') + '-cloned').appendTo($(this).parent());
    });

  };

  SITE.prototype.initSwiper = function() {
    var $vimeo = $('#penyelamat');

    //Intialize Slider
    var swiper = new Swiper('#hero', {
      pagination: '.swiper-pagination',
      paginationClickable: true,
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      parallax: true,
      speed: 1000,
      onSlideChangeStart: function(sw) {
        if (sw.activeIndex === 1) {
          $vimeo.vimeo('play');
        }
        else {
          $vimeo.vimeo('pause');
        }

        $vimeo.appear();

        $vimeo.on('appear', function() {
          if (swiper.activeIndex == 1) {
            $vimeo.vimeo('play');
          }
        });
        $vimeo.on('disappear', function() {
          if (swiper.activeIndex == 1) {
            $vimeo.vimeo('pause');
          }
        });
      }
    });

    $('.watchvid').click(function(ev) {
      ev.preventDefault();
      swiper.slideTo(1);
    });
  };

  SITE.prototype.initInstagramIsotope = function() {
     $(".instagram-isotope").each(function () {
      var $this = $(this);

      $.getJSON('http://wms-api.herokuapp.com/hh/instagram/feed?callback=?', function(data) {
        $(data.data).each(function (index, feed) {
          if (index < 4) {
            var item = $('\
              <div class="grid">\
                <a href="' + feed.link + '" target="_blank">\
                  <img src="' + feed.images.standard_resolution.url + '" alt="">\
                  <span class="likes"><i class="fa fa-heart"></i> ' + feed.likes.count + '</span>\
                  <span class="caption">' + feed.caption.text + '</span>\
                </a>\
              </div>');
            $this.append(item);
          }
        });

        $this.waitForImages(true).done(function() {
          $this.isotope({
            itemSelector: ".grid",
            percentPosition: true,
            masonry: {
              columnWidth: ".grid-sizer",
              gutter: 0
            }
          });
        });
      });
    });
  };

  SITE.prototype.initForm = function() {
    var $contactForm = $('#contact-form');
    $contactForm.validate({
      submitHandler: function(form) {
        $contactForm.find('.alert').remove();

        $.ajax({
          url: '//formspree.io/newmedia@hafizhamidun.com',
          method: 'POST',
          data: $contactForm.serialize(),
          dataType: 'json',

          success: function(data) {
            $contactForm.append('<div class="alert alert-success fade in" role="alert"><button class="close" data-dismiss="alert"></button><i class="fa fa-check"></i> <strong>Success</strong> Your message has been sent. Thank you.</div>');
          },

          error: function(err) {
            $contactForm.append('<div class="alert alert-error fade in" role="alert"><button class="close" data-dismiss="alert"></button><i class="fa fa-times"></i> <strong>Error</strong> Please correct the errors above.</div>');
          }
        });
      },

      invalidHandler: function(event, validator) {
        console.log(validator.numberOfInvalids());
        $contactForm.find('.alert').remove();
        $contactForm.append('<div class="alert alert-error fade in" role="alert"><button class="close" data-dismiss="alert"></button><i class="fa fa-times"></i> <strong>Invalid</strong> Please correct the errors above.</div>');
      }
    });
  };

  SITE.prototype.initSocial = function () {
    var nFormatter = function(num, digits) {
      var si = [
        { value: 1E18, symbol: "E" },
        { value: 1E15, symbol: "P" },
        { value: 1E12, symbol: "T" },
        { value: 1E9,  symbol: "G" },
        { value: 1E6,  symbol: "M" },
        { value: 1E3,  symbol: "k" }
      ], i;
      for (i = 0; i < si.length; i++) {
        if (num >= si[i].value) {
          return (num / si[i].value).toFixed(digits).replace(/\.?0+$/, "") + si[i].symbol;
        }
      }
      return num;
    };

    $('.c-facebook').each(function () {
      $.getJSON('http://wms-api.herokuapp.com/hh/facebook?callback=?', function(data) {
        $('.count', this).html(nFormatter(data.likes, 1));
        $(this).addClass('loaded');
      }.bind(this));
    });

    $('.c-twitter').each(function () {
      $.getJSON('http://wms-api.herokuapp.com/hh/twitter?callback=?', function(data) {
        $('.count', this).html(nFormatter(data.followers_count, 1));
        $(this).addClass('loaded');
      }.bind(this));
    });

    $('.c-instagram').each(function () {
      $.getJSON('http://wms-api.herokuapp.com/hh/instagram?callback=?', function(data) {
        $('.count', this).html(nFormatter(data.data.counts.followed_by, 1));
        $(this).addClass('loaded');
      }.bind(this));
    });

    $('.c-youtube').each(function () {
      $.getJSON('http://wms-api.herokuapp.com/hh/youtube?callback=?', function(data) {
        $('.count', this).html(nFormatter(data.items[0].statistics.subscriberCount, 1));
        $(this).addClass('loaded');
      }.bind(this));
    });

    $('.c-spotify').each(function () {
      $.getJSON('http://wms-api.herokuapp.com/hh/spotify?callback=?', function(data) {
        $('.count', this).html(nFormatter(data.followers.total, 1));
        $(this).addClass('loaded');
      }.bind(this));
    });

    $('.c-soundcloud').each(function () {
      $.getJSON('http://wms-api.herokuapp.com/hh/soundcloud?callback=?', function(data) {
        $('.count', this).html(nFormatter(data.followers_count, 1));
        $(this).addClass('loaded');
      }.bind(this));
    });
  };

  SITE.prototype.init = function() {
    FastClick.attach(document.body);
    this.initSlabtext();
    this.initMisc();
    this.initSwiper();
    this.initSocial();
    this.initInstagramIsotope();
    this.initForm();
  };

  $.Pages.SITE = new SITE();
  $.Pages.SITE.Constructor = SITE;

  $(function() {
    $.Pages.init();
    $.Pages.SITE.init();
  });
}(window.jQuery);
