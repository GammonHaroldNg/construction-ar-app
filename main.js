// Replace with your own free Mapbox access token!
mapboxgl.accessToken = 'pk.eyJ1IjoiaGFyb2xkbmciLCJhIjoiY21ncTRkcG9wMDE5NTJqcHhmMDUzYWxmNSJ9.5clGvHOhvwTRx2z9lwNAkA';

// Initialize the map - show only the overlay image
const map = new mapboxgl.Map({
  container: 'map',
  style: { "version": 8, "sources": {}, "layers": [] },
  center: [114.1095, 22.3964],
  zoom: 19
});

// Overlay a site plan image (adjust coordinates as needed)
map.on('load', () => {
  map.addSource('site', {
    'type': 'image',
    'url': 'images/GT-Core-Plan.png',
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
    lngLat: [114.1090, 22.3965],
    image: 'images/3F-Lobby-A.png',
    thumbnail: 'images/thumb-Lobby-A.png',
    label: 'Lobby 1'
  },
  {
    lngLat: [114.1090, 22.3960],
    image: 'images/3F-Lobby-D.png',
    thumbnail: 'images/thumb-Lobby-D.png',
    label: 'Lobby 3'
  },
  {
    lngLat: [114.1098, 22.3965],
    image: 'images/3F-Lobby-B.png',
    thumbnail: 'images/thumb-Lobby-B.png',
    label: 'Lobby 2'
  },
  {
    lngLat: [114.1098, 22.3960],
    image: 'images/3F-Lobby-C.png',
    thumbnail: 'images/thumb-Lobby-C.png',
    label: 'Lobby 4'
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
      <a href="viewer.html?img=${encodeURIComponent(markerData.image)}" target="_blank">
      <button>View 360</button>
      </a>
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
  document.getElementById('sky360').setAttribute('material', 'opacity: 1; transparent: true; side: double;');
  document.getElementById('ghostRange').value = 1;
  document.getElementById('ghostSliderBox').style.display = "flex";

}

function closeViewer() {
  const viewer = document.getElementById('viewerContainer');
  viewer.style.display = "none";
  document.getElementById('sky360').setAttribute('src', "");
  document.getElementById('ghostSliderBox').style.display = "none";

}

// Ghost mode slider - update opacity
document.getElementById('ghostRange').addEventListener('input', function() {
  const opacityValue = this.value;
  document.getElementById('sky360').setAttribute('material', `opacity: ${opacityValue}; transparent: true; side: double;`);
});

// Workaround: Pre-initialize the viewer for mobile and desktop
window.addEventListener('DOMContentLoaded', function() {
  const viewer = document.getElementById('viewerContainer');
  viewer.style.display = "block";
  viewer.style.opacity = "0";
  setTimeout(function() {
    viewer.style.display = "none";
    viewer.style.opacity = "1";
  }, 500);
});
