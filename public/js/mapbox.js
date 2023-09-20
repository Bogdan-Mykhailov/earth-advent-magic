'use strict';
export const displayMap = (locations) => {
  mapboxgl.accessToken = 'pk.eyJ1IjoiYm9nZGFuMTAwMyIsImEiOiJjbG1yZmlubWUwMGFsMmlvbG10MXJybmxqIn0.3fe__c61dIC6K7HoeJMoOQ';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/bogdan1003/clmrhhl1a027a01qua0zm846n',
    scrollZoom: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // add popup
    new mapboxgl.Popup({
      offset: 30,
      focusAfterOpen: false,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map)

    // extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, { padding: 200 });
};

