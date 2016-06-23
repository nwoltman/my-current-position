'use strict';

(function() {
  var ACCEPTABLE_ACCURACY_LIMIT = 1000;

  var gmaps = google.maps;
  var inaccuracyRetriesLeft = 1;
  var p = document.getElementById('p');
  var button = document.getElementById('button');
  var positionErrors = [
    null,
    'PERMISSION_DENIED',
    'POSITION_UNAVAILABLE',
    'TIMEOUT',
  ];
  var positionOptions = {timeout: 9000};
  var map = new gmaps.Map(document.getElementById('map'), {
    zoom: 17,
  });
  var marker;
  var circle;

  function onPositionSuccess(position) {
    var coords = position.coords;

    if (coords.accuracy > ACCEPTABLE_ACCURACY_LIMIT && inaccuracyRetriesLeft > 0) {
      --inaccuracyRetriesLeft;
      setTimeout(findPosition, 100);
      return;
    }

    p.innerHTML =
      'latitude: ' + coords.latitude + '<br>' +
      'longitude: ' + coords.longitude + '<br>' +
      'accuracy: ' + coords.accuracy + ' m';
    button.disabled = false;

    var googleCoords = {
      lat: coords.latitude,
      lng: coords.longitude,
    };
    map.setCenter(googleCoords);

    marker = new gmaps.Marker({
      position: googleCoords,
      map: map,
      title: 'You are here',
    });
    circle = new gmaps.Circle({
      strokeColor: '#007AFF',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#007AFF',
      fillOpacity: 0.3,
      map: map,
      center: googleCoords,
      radius: coords.accuracy,
    });
  }

  function onPositionError(error) {
    p.textContent = 'ERROR: ' + error.message + ' (' + positionErrors[error.code] + ')';
    button.disabled = false;
  }

  function findPosition() {
    p.textContent = 'Determining your position...';
    button.disabled = true;
    if (marker) {
      marker.setMap(null);
      marker = null;
    }
    if (circle) {
      circle.setMap(null);
      circle = null;
    }
    navigator.geolocation.getCurrentPosition(onPositionSuccess, onPositionError, positionOptions);
  }

  button.addEventListener('click', findPosition);

  findPosition();
})();
