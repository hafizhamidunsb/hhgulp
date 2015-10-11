!function($) {
  'use strict';

  var SITE = function() {
    this.VERSION = "1.0.0";
    this.Pages = $.Pages;
  };

  SITE.prototype.initMisc = function() {
    // // FADE OUT
    // $(document).on('click', 'a', function(event) {
    //   event.preventDefault();
    //   var link = this.href;
    //   $('body').one('webkitTransitionEnd mozTransitionEnd MSTransitionEnd oatransitionend atransitionend', function() {
    //     document.location.href = link;
    //   });
    //   $('body').removeClass('pace-done');
    //
    //   // $('body').one('webkitTransitionEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
    //   //   document.location.href = link;
    //   // })
    //   // $('body').addClass('animated fadeOut');
    // });

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
    $('<div class="menu-overlay"/>').appendTo($('.header'));

    $('[data-fitvids]').fitVids();

    $('body:not(.mobile)').find('h1, h2, h3, h4, h5, h6, p').filter(':not(.no-orphan)').unorphanize();

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

  SITE.prototype.initSlider = function() {
    //Intialize Slider
    var slider = new Swiper('#hero', {
      pagination: '.swiper-pagination',
      paginationClickable: true,
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      parallax: true,
      speed: 1000
    });
  };

  SITE.prototype.initIsotope = function() {
    var $gallery = $(".gallery");
    var applyIsotope = function() {
      $gallery.isotope({
        itemSelector: ".grid",
        percentPosition: true,
        layoutMode: 'fitRows',
        fitRows: {
          columnWidth: ".grid-sizer",
          gutter: 0
        }
      });
      setTimeout(function () {
        $gallery.isotope("layout");
      });
    }

    $gallery.waitForImages(true).done(function() {
      applyIsotope();
    });
  };

  SITE.prototype.initInstagramFeed = function() {
    var $insta = $(".instagram-isotope");

    $insta.isotope({
      itemSelector: ".grid",
      percentPosition: true,
      masonry: {
        columnWidth: ".grid-sizer",
        gutter: 0
      }
    });

    $.getJSON('http://wms-api.herokuapp.com/instagram/feed?callback=?', function(data) {
      $(data.data).each(function (index, feed) {
        if (index < 5) {
          var item = $('\
            <div class="grid">\
              <a href="' + feed.link + '" target="_blank">\
                <img src="' + feed.images.standard_resolution.url + '" alt="">\
                <span class="likes"><i class="fa fa-heart"></i> ' + feed.likes.count + '</span>\
                <span class="caption">' + feed.caption.text + '</span>\
              </a>\
            </div>');
          $insta.append(item);
          setTimeout(function () {
            $insta.isotope( 'appended', item );
          }, 100);
        }
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

    $.getJSON('http://wms-api.herokuapp.com/facebook?callback=?', function(data) {
      $('.c-facebook .count').html(nFormatter(data.likes, 1));
      $('.c-facebook').addClass('loaded');
    });

    $.getJSON('http://wms-api.herokuapp.com/twitter?callback=?', function(data) {
      $('.c-twitter .count').html(nFormatter(data.followers_count, 1));
      $('.c-twitter').addClass('loaded');
    });

    $.getJSON('http://wms-api.herokuapp.com/instagram?callback=?', function(data) {
      $('.c-instagram .count').html(nFormatter(data.data.counts.followed_by, 1));
      $('.c-instagram').addClass('loaded');
    });

    $.getJSON('http://wms-api.herokuapp.com/youtube?callback=?', function(data) {
      $('.c-youtube .count').html(nFormatter(data.items[0].statistics.subscriberCount, 1));
      $('.c-youtube').addClass('loaded');
    });

    $.getJSON('http://wms-api.herokuapp.com/spotify?callback=?', function(data) {
      $('.c-spotify .count').html(nFormatter(data.followers.total, 1));
      $('.c-spotify').addClass('loaded');
    });

    $.getJSON('http://wms-api.herokuapp.com/soundcloud?callback=?', function(data) {
      $('.c-soundcloud .count').html(nFormatter(data.followers_count, 1));
      $('.c-soundcloud').addClass('loaded');
    });
  };

  SITE.prototype.init = function() {
    this.initMisc();
    this.initSlider();
    this.initIsotope();
    this.initForm();
    this.initSocial();
    this.initInstagramFeed();
  };

  $.Pages.SITE = new SITE();
  $.Pages.SITE.Constructor = SITE;

  $.Pages.init();
  $.Pages.SITE.init();

}(window.jQuery);
