// Replace with your own free Mapbox access token!
mapboxgl.accessToken = 'pk.eyJ1IjoiaGFyb2xkbmciLCJhIjoiY21ncTRkcG9wMDE5NTJqcHhmMDUzYWxmNSJ9.5clGvHOhvwTRx2z9lwNAkA';

// Initialize the map with a blank style so only the overlay image is visible
const map = new mapboxgl.Map({
  container: 'map',
  style: { "version": 8, "sources": {}, "layers": [] },
  center: [114.1095, 22.3964],
  zoom: 17
});

// Overlay a site plan image (adjust coordinates as needed)
map.on('load', () => {
  map.addSource('site', {
    'type': 'image',
    'url': 'images/siteplan.png', // Change to your site plan image if needed
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

// Preset markers for 360 locations
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

// Add preset markers and popups
presetMarkers.forEach(markerData => {
  const marker = new mapboxgl.Marker()
    .setLngLat(markerData.lngLat)
    .addTo(map);

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
  marker.getElement().addEventListener('click', () => {
    setTimeout(() => {
      const btnId = `view360-${markerData.lngLat[0]}-${markerData.lngLat[1]}`;
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.onclick = () => {
          showViewer(marker._imageFileName);
        };
      }
    }, 100);
  });
});

function showViewer(imageSrc) {
  const viewer = document.getElementById('viewerContainer');
  viewer.style.display = "block";
  document.getElementById('sky360').setAttribute('src', imageSrc);
}

function closeViewer() {
  const viewer = document.getElementById('viewerContainer');
  viewer.style.display = "none";
  document.getElementById('sky360').setAttribute('src', "");
}

// Workaround: Pre-initialize the A-Frame/WebGL viewer when the DOM is loaded
window.addEventListener('DOMContentLoaded', function() {
  const viewer = document.getElementById('viewerContainer');
  viewer.style.display = "block";
  viewer.style.opacity = "0";
  setTimeout(function() {
    viewer.style.display = "none";
    viewer.style.opacity = "1";
  }, 500);
});
