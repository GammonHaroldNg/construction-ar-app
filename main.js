// Replace with your own free Mapbox access token!
mapboxgl.accessToken = 'pk.eyJ1IjoiaGFyb2xkbmciLCJhIjoiY21ncTRkcG9wMDE5NTJqcHhmMDUzYWxmNSJ9.5clGvHOhvwTRx2z9lwNAkA';

// Initialize the map (adjust center & zoom to your site)
const map = new mapboxgl.Map({
  container: 'map',
  style: {
    "version": 8,
    "sources": {},
    "layers": []
  },
  center: [114.1095, 22.3964],
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

// Define an array of preset markers, each with coordinates and image filename
const presetMarkers = [
  {
    lngLat: [114.1090, 22.3968],  // Example 1: adjust to your real coordinates
    image: 'images/360-1.jpg',
    label: 'Main Entrance'
  },
  {
    lngLat: [114.1100, 22.3960],  // Example 2: adjust
    image: 'images/360-2.jpg',
    label: 'Site Center'
  }
];

// Add markers to the map, each with a popup (label) and image association
presetMarkers.forEach(markerData => {
  const marker = new mapboxgl.Marker()
    .setLngLat(markerData.lngLat)
    .setPopup(new mapboxgl.Popup().setText(markerData.label))
    .addTo(map);

  // Store the image file name in the marker for later use
  marker._imageFileName = markerData.image;

  // (Optionally) Add a click event to the marker for loading the 360 image:
  marker.getElement().addEventListener('click', function() {
    // TODO: Code for loading marker._imageFileName in the A-Frame viewer here
    alert('Would load image: ' + marker._imageFileName);
  });
});

