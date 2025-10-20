// Replace with your own free Mapbox access token!
mapboxgl.accessToken = 'pk.eyJ1IjoiaGFyb2xkbmciLCJhIjoiY21ncTRkcG9wMDE5NTJqcHhmMDUzYWxmNSJ9.5clGvHOhvwTRx2z9lwNAkA';

// Initialize the map - show only the overlay image
const map = new mapboxgl.Map({
  container: 'map',
  style: { "version": 8, "sources": {}, "layers": [] },
  center: [114.1095, 22.3964],
  zoom: 18.5
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
    lngLat: [114.10915, 22.3967],
    image: 'images/3F-Lobby-A.png',
    thumbnail: 'images/thumb-Lobby-A.png',
    label: 'Lobby 1'
  },
  {
    lngLat: [114.10915, 22.3960],
    image: 'images/3F-Lobby-D.png',
    thumbnail: 'images/thumb-Lobby-D.png',
    label: 'Lobby 3'
  },
  {
    lngLat: [114.10965, 22.3967],
    image: 'images/3F-Lobby-B.png',
    thumbnail: 'images/thumb-Lobby-B.png',
    label: 'Lobby 2'
  },
  {
    lngLat: [114.10965, 22.3960],
    image: 'images/3F-Lobby-C.png',
    thumbnail: 'images/thumb-Lobby-C.png',
    label: 'Lobby 4'
  },
    {
    lngLat: [114.10970, 22.3955],
    image: 'images/3F-06.png',
    label: 'Floor Platten'
  },
    {
    lngLat: [114.10975, 22.3955],
    image: 'images/QRC-Facade-Day.png',
    label: 'QRC Facade Day Time'
  },
    {
    lngLat: [114.10980, 22.3955],
    image: 'images/QRC-Facade-Night.png',
    label: 'QRC Facade Night Time'
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

// Start camera stream as video background
const video = document.getElementById('videoBg');
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => { video.srcObject = stream; })
    .catch(err => { alert('Camera access denied or unavailable.'); });
} else {
  alert('Camera API not supported.');
}

// Get image path from URL parameter
const params = new URLSearchParams(location.search);
const imgSrc = params.get("img") || "images/360-1.jpg";
const skyEl = document.getElementById("sky360");
skyEl.setAttribute("material", "src", imgSrc);
skyEl.setAttribute("material", "opacity", 1);

// Ghost Mode Opacity Control
document.getElementById("ghostToggle").addEventListener("input", function(e) {
  skyEl.setAttribute('material', 'opacity', parseFloat(e.target.value));
});

// Alignment controls (lock/unlock)
let controlsLocked = false;

// Buttons for lock/unlock
const lockBtn = document.getElementById("lockAlign");
const unlockBtn = document.getElementById("unlockAlign");

lockBtn.addEventListener("click", function() {
  controlsLocked = true;
  lockBtn.disabled = true;
  unlockBtn.disabled = false;
  alert("Alignment locked! Now move your phone to view the design with gyroscope.");
});
unlockBtn.addEventListener("click", function() {
  controlsLocked = false;
  lockBtn.disabled = false;
  unlockBtn.disabled = true;
});

// --- Mobile Gesture Logic for Rotation and Zoom --- //
let lastTouchX = null, lastRotationY = 0;
let initialPinchDist = null, initialScale = -1;
let sphereScale = -1;   // Start at -1 for correct orientation
let rotationY = 0;

const aScene = document.querySelector('a-scene');

// Touch start: single for rotate, double for pinch
aScene.addEventListener('touchstart', function(e){
  if (controlsLocked) return;
  if (e.touches.length === 1) {
    lastTouchX = e.touches[0].clientX;
  }
  if (e.touches.length === 2) {
    initialPinchDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    initialScale = sphereScale;
  }
});

// Touch move: single for rotate (yaw), double for pinch zoom (scale)
aScene.addEventListener('touchmove', function(e){
  if (controlsLocked) return;
  // One finger: rotate horizontally
  if (e.touches.length === 1 && lastTouchX!==null) {
    let deltaX = e.touches[0].clientX - lastTouchX;
    rotationY += deltaX * 0.25;    // Adjust sensitivity as needed
    skyEl.setAttribute("rotation", `0 ${rotationY} 0`);
    lastTouchX = e.touches[0].clientX;
  }
  // Two fingers (pinch): zoom in/out
  if (e.touches.length === 2 && initialPinchDist!==null) {
    let newDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    let scaleFactor = newDist / initialPinchDist;
    sphereScale = Math.max(-2, Math.min(-0.3, initialScale * scaleFactor));
    skyEl.setAttribute("scale", `${sphereScale} 1 1`);
  }
});

// Reset interaction state
aScene.addEventListener('touchend', function(e){
  lastTouchX = null;
  initialPinchDist = null;
});
