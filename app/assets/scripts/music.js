!function($) {

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

        var $info = $(this).find(".info");
        var $infoBg = $(this).find(".info-bg");
        var $label = $info.find(".label");

        var color = colorThief.getColor($img[0]);
        var palette = colorThief.getPalette($img[0]);

        $infoBg.css("background-color", rgba(color));

        var darkestColor = getDarkestColor(palette);
        var lightestColor = getLightestColor(palette);
        var contraColor = isDark(color) ? lightestColor : darkestColor;

        $info.css("color", rgba(contraColor));

        $label.css({
          "border-color": rgba(contraColor),
          "color": rgba(contraColor)
        });

        var $links = $(this).find(".links");
        var $btn = $links.find(".btn");

        $btn.css({
          "background-color": rgba(contraColor),
          "color": rgba(color)
        });

      });
    });
  });

  var $lightbox = $('.video-lightbox');
  var $video = $lightbox.find('.video');

  $lightbox._open = function() {
    $lightbox.addClass('vlb-visible');
  }
  $lightbox._close = function() {
    $lightbox.removeClass('vlb-visible');
    setTimeout(function() { $video.empty(); }, 500);
  }

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

}(window.jQuery);
