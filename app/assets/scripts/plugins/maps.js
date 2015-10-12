!function($) {

  "use strict";

  if (typeof google === "undefined") {
    return;
  }

  // When the window has finished loading create our google map below
  google.maps.event.addDomListener(window, "load", init);

  var map;
  var zoomLevel = 15;

  function init() {
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions

    var latLng = {lat: 2.945131, lng: 101.722629};

    var mapOptions = {
      // How zoomed in you want the map to start at (always required)
      zoom: zoomLevel,
      disableDefaultUI: true,
      // The latitude and longitude to center the map (always required)
      center: latLng, // neo Damansara
      scrollwheel: false,
      draggable: true,
      // Map styling
      // https://snazzymaps.com/style/25/blue-water
      styles: [{"stylers":[{"hue":"#007fff"},{"saturation":89}]},{"featureType":"water","stylers":[{"color":"#ffffff"}]},{"featureType":"administrative.country","elementType":"labels","stylers":[{"visibility":"off"}]}]
    };

    // Get the HTML DOM element that will contain your map
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById("google-maps");

    // Create the Google Map using out element and options defined above
    map = new google.maps.Map(mapElement, mapOptions);

    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      title: 'Seagate Global Trading'
    });
  }

}(window.jQuery);
