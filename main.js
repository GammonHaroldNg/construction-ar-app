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
    lngLat: [114.1090, 22.3968],
    image: 'images/360-1.jpg',
    thumbnail: 'images/thumb-1.png',
    label: 'Main Entrance'
  },
  {
    lngLat: [114.1100, 22.3960],
    image: 'images/360-2.jpg',
    thumbnail: 'images/thumb-2.png',
    label: 'Site Center'
  }
];

presetMarkers.forEach(markerData => {
  const marker = new mapboxgl.Marker()
    .setLngLat(markerData.lngLat)
    .addTo(map);

  // Create popup HTML with thumbnail and label
  const popupContent = `
    <div style="text-align:center;">
      <strong>${markerData.label}</strong><br>
      <img src="${markerData.thumbnail}" alt="thumbnail" width="120" style="margin:8px 0;display:block;" />
      <button id="view360-${markerData.lngLat[0]}-${markerData.lngLat[1]}">View 360°</button>
    </div>
  `;

  const popup = new mapboxgl.Popup().setHTML(popupContent);
  marker.setPopup(popup);

  marker._imageFileName = markerData.image;

  // Wait for the popup to be added to DOM, then add button event
  marker.getElement().addEventListener('click', () => {
    setTimeout(() => {
      const btnId = `view360-${markerData.lngLat[0]}-${markerData.lngLat[1]}`;
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.onclick = () => {
          // Replace this with logic to trigger 360 viewer for marker._imageFileName
          alert('Would load image: ' + marker._imageFileName);
        };
      }
    }, 100);
  });
});
