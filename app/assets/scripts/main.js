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
      }
    });

    $('.watchvid').click(function(ev) {
      ev.preventDefault();
      swiper.slideTo(1);
    });

    // $vimeo.appear();
    // $vimeo.on('appear', function() {
    //   $vimeo.vimeo('play');
    // });
    // $vimeo.on('disappear', function() {
    //   $vimeo.vimeo('pause');
    // });
  };

  SITE.prototype.initMusicIsotope = function() {
    $(".music-isotope").each(function() {
      var $this = $(this);

      function applyIsotope() {
        $this.isotope({
          itemSelector: ".grid",
          percentPosition: true,
          layoutMode: "masonry",
          masonry: {
            columnWidth: ".grid-sizer"
          },
          getSortData: {
            title: '.title',
            released: '[data-released]'
          },
          sortBy: 'released',
          sortAscending: {
            title: true,
            released: false
          }
        });
        setTimeout(function() {
          $this.isotope("layout");
        });

        $('.sort-button-group').on('click', 'button', function() {
          var sortValue = $(this).data('sortValue');
          $this.isotope({ sortBy: sortValue });
        });

        $('.sort-button-group').each( function( i, buttonGroup ) {
          var $buttonGroup = $( buttonGroup );
          $buttonGroup.on( 'click', 'button', function() {
            $buttonGroup.find('.is-checked').removeClass('is-checked');
            $( this ).addClass('is-checked');
          });
        });

        $('.filter-button-group').on('click', 'button', function() {
          var filterValue = $(this).data('filterValue');
          $this.isotope({ filter: filterValue });
        });

        $('.filter-button-group').each( function( i, buttonGroup ) {
          var $buttonGroup = $( buttonGroup );
          $buttonGroup.on( 'click', 'button', function() {
            $buttonGroup.find('.is-checked').removeClass('is-checked');
            $( this ).addClass('is-checked');
          });
        });
      }

      function rgba(color, alpha) {
        if (typeof alpha === "undefined") {
          alpha = 1;
        }

        return "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + alpha + ")"
      }

      function yiq(color) {
        var rgb = rgba(color).match(/\d+/g);
        return ((rgb[0]*299)+(rgb[1]*587)+(rgb[2]*114))/1000;
      }

      function getDarkestColor(palette) {
        var darkestColor = palette[0], darkestLuma = 255, luma;
        $.each(palette, function(index, color) {
          luma = yiq(color);
          if (luma < darkestLuma) {
            darkestColor = color;
            darkestLuma = luma;
          }
        });

        return darkestColor;
      }

      function getLightestColor(palette) {
        var lightestColor = palette[0], lightestLuma = 0, luma;
        $.each(palette, function(index, color) {
          luma = yiq(color);
          if (luma > lightestLuma) {
            lightestColor = color;
            lightestLuma = luma;
          }
        });

        return lightestColor;
      }

      function lightDarkClass(el, color) {
        if (yiq(color) >= 128) {
          el.removeClass('dark').addClass('light');
        } else {
          el.removeClass('light').addClass('dark');
        }
      }

      function isDark(color) {
        return yiq(color) <= 128;
      }

      var colorThief = new ColorThief();
      $this.waitForImages(true).done(function() {
        applyIsotope();
        $this.find(".grid").each(function () {
          var $img = $(this).find("img");
          var imgSrc = $img.attr("src");

          var $bg = $(this).find(".bg");
          $bg.css("background-image", "url(" + imgSrc + ")");
          $img.remove();

          var $info = $(this).find(".info");
          var $label = $info.find(".label");

          var color = colorThief.getColor($img[0]);
          var palette = colorThief.getPalette($img[0]);

          $info.css("background-color", rgba(color, .8));

          var darkestColor = getDarkestColor(palette);
          var lightestColor = getLightestColor(palette);

          $info.css("color", rgba(isDark(color) ? lightestColor : darkestColor));
          $label.css({
            "background-color": rgba(isDark(color) ? lightestColor : darkestColor),
            "color": rgba(color)
          });

          var $links = $(this).find(".links");
          var $btn = $links.find(".btn");

          $links.css({
            "background-color": rgba(lightestColor, .8),
            "color": rgba(darkestColor)
          });

          $btn.css({
            "background-color": rgba(darkestColor),
            "color": rgba(lightestColor)
          });

        });
      });
    });
  };

  SITE.prototype.initInstagramIsotope = function() {
     $(".instagram-isotope").each(function () {
      var $this = $(this);

      $this.isotope({
        itemSelector: ".grid",
        percentPosition: true,
        masonry: {
          columnWidth: ".grid-sizer",
          gutter: 0
        }
      });

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
            setTimeout(function () {
              $this.isotope( 'appended', item );
            }, 100);
          }
        });
        setTimeout(function () {
          $this.isotope( 'layout' );
        }, 250);
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
    this.initMisc();
    this.initSwiper();
    this.initSocial();
    this.initInstagramIsotope();
    this.initMusicIsotope();
    this.initForm();
  };

  $.Pages.SITE = new SITE();
  $.Pages.SITE.Constructor = SITE;

  $.Pages.init();
  $.Pages.SITE.init();

}(window.jQuery);
