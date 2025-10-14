// Replace with your own free Mapbox access token!
mapboxgl.accessToken = 'pk.eyJ1IjoiaGFyb2xkbmciLCJhIjoiY21ncTRkcG9wMDE5NTJqcHhmMDUzYWxmNSJ9.5clGvHOhvwTRx2z9lwNAkA';

// Initialize the map (adjust center & zoom to your site)
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v11',
  center: [114.1095, 22.3964], // Example: Hong Kong; change to your location
  zoom: 17
});

// Overlay a site plan image (adjust coordinates to your site)
map.on('load', () => {
  map.addSource('site', {
    'type': 'image',
    'url': 'images/siteplan.png',
    'coordinates': [
      [114.1085, 22.3972], // top left (lng, lat)
      [114.1105, 22.3972], // top right
      [114.1105, 22.3956], // bottom right
      [114.1085, 22.3956]  // bottom left
    ]
  });
  map.addLayer({
    'id': 'site',
    'type': 'raster',
    'source': 'site',
    'paint': { 'raster-opacity': 0.85 }
  });
});

// Array to store markers (optionally with related 360 image info)
let markers = [];

// Add marker on map click
map.on('click', function(e) {
  const marker = new mapboxgl.Marker({ draggable: true })
    .setLngLat(e.lngLat)
    .addTo(map);

  // You can associate a 360 image filename with this marker later!
  marker._imageFileName = null; // Placeholder
  markers.push(marker);

  // For now, show simple popup
  marker.setPopup(new mapboxgl.Popup().setText('New marker placed here!')).togglePopup();

  // Optionally: Display marker coordinates in the console for reference
  console.log('Marker placed at: ', e.lngLat);
});
