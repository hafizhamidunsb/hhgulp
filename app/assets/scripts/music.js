!function($) {

  FastClick.attach(document.body);

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
          title: '[data-title]',
          released: '[data-released]'
        },
        sortBy: 'released',
        sortAscending: {
          title: true,
          released: false
        },

        transitionDuration: '.8s',
        hiddenStyle: {
          transform: 'translateY(-100%)',
          opacity: 0
        },
        visibleStyle: {
          transform: 'translateY(0)',
          opacity: 1
        }
      });
      setTimeout(function() {
        $this.isotope("layout");
      });

      $this.on('layoutComplete', function( event, filteredItems ) {
        $this.addClass('loaded');
      });

      $('.sort-button-group').on('click', 'button', function() {
        var sortValue = $(this).data('sortValue');
        console.log(sortValue);
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

    function applyColors() {
      // convert 0..255 R,G,B values to a hexidecimal color string
      var RGBToHex = function(r,g,b){
        var bin = r << 16 | g << 8 | b;
        return (function(h){
          return new Array(7-h.length).join("0")+h
        })(bin.toString(16).toUpperCase())
      }

      // convert a hexidecimal color string to 0..255 R,G,B
      var hexToRGB = function(hex){
        hex = parseInt(hex, 16);
        var r = hex >> 16;
        var g = hex >> 8 & 0xFF;
        var b = hex & 0xFF;
        return [r,g,b];
      }

      var rgba = function(color, alpha) {
        alpha = parseFloat(alpha) || 1;

        return "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + alpha + ")"
      }

      var yiq = function(color) {
        var rgb = rgba(color).match(/\d+/g);
        return ((rgb[0]*299)+(rgb[1]*587)+(rgb[2]*114))/1000;
      }

      var getDarkestColor = function(palette) {
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

      var getLightestColor = function(palette) {
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

      var isDark = function(color) {
        return yiq(color) <= 128;
      }

      var colorThief = new ColorThief();

      $this.find(".grid").each(function() {
        var bgColor = $(this).data('bg-color');
        var fgColor = $(this).data('fg-color');

        if (typeof bgColor !== 'undefined') {
          bgColor = hexToRGB(bgColor);
        }
        if (typeof fgColor !== 'undefined') {
          fgColor = hexToRGB(fgColor);
        }

        var $img = $(this).find("img");

        var $info = $(this).find(".info");
        var $infoBg = $(this).find(".info-bg");
        var $label = $info.find(".label");

        if (typeof bgColor === 'undefined') {
          bgColor = colorThief.getColor($img[0]);
        }

        var palette = colorThief.getPalette($img[0]);
        var p = $(this).data('palette');

        if (typeof p !== 'undefined') {
          bgColor = palette[parseInt(p)];
        }

        if (typeof fgColor === 'undefined') {
          fgColor = isDark(bgColor) ? getLightestColor(palette) : getDarkestColor(palette);
        }

        $infoBg.css("background-color", rgba(bgColor));
        $info.css("color", rgba(fgColor));
        $label.css({
          "border-color": rgba(fgColor),
          "color": rgba(fgColor)
        });

        var $links = $(this).find(".links");
        var $btn = $links.find(".btn");

        $btn.css({
          "background-color": rgba(fgColor),
          "color": rgba(bgColor)
        });

      });
    }

    $this.waitForImages(true).done(function() {
      applyIsotope();
      applyColors();
    });
  });

  var lightbox = function() {
    var $lightbox = $('.video-lightbox');
    var $video = $lightbox.find('.vlb-video');
    var $close = $lightbox.find('.vlb-close');

    $lightbox._open = function() {
      $lightbox.addClass('vlb-visible');
    }
    $lightbox._close = function() {
      $lightbox.removeClass('vlb-visible');
      setTimeout(function() { $video.empty(); }, 500);
    }
    $close.click($lightbox._close);

    $(document).on('keyup',function(evt) {
      if (evt.keyCode == 27) {
        $lightbox._close();
      }
    });

    $lightbox.click(function (ev) {
      $lightbox._close();
    });

    $('[data-youtube-embed]').each(function () {
      var url = $(this).data('youtubeEmbed');

      $(this).click(function (ev) {
        $lightbox._open();

        setTimeout(function () {
          $video.html('<iframe width="560" height="315" src="' + url + '" frameborder="0" allowfullscreen></iframe>').fitVids();
        }, 500);

        ev.preventDefault();
        ev.stopPropagation();
      });

    });
  }

  lightbox();

}(window.jQuery);
