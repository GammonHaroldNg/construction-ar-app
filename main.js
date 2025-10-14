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
    'url': 'image.jpg',
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
