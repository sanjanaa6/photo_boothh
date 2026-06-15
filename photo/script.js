const startBtn = document.getElementById('start-btn');
const filterSelection = document.getElementById('filter-selection');
const cameraSection = document.getElementById('camera-section');
const video = document.getElementById('video');
const countdownDiv = document.getElementById('countdown');
const photosSection = document.getElementById('photos-section');
const photosDiv = document.getElementById('photos');
const restartBtn = document.getElementById('restart-btn');
const saveBtn = document.getElementById('save-btn');
const takePhotosBtn = document.getElementById('take-photos-btn');
let selectedFilter = 'none';
let stream = null;
let capturedPhotos = [];

startBtn.onclick = async () => {
  startBtn.style.display = 'none';
  cameraSection.style.display = 'block';
  filterSelection.style.display = 'block';
  await startCamera();
  // Set default filter
  video.style.filter = selectedFilter;
  
  // Add sliding animation after a small delay
  setTimeout(() => {
    cameraSection.classList.add('show');
  }, 100);
};

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.onclick = () => {
    // Remove active class from all filter buttons
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    // Add active class to clicked button
    btn.classList.add('active');
    
    selectedFilter = btn.getAttribute('data-filter');
    video.style.filter = selectedFilter;
  };
});

takePhotosBtn.onclick = () => {
  filterSelection.style.display = 'none';
  startPhotoSequence();
};

async function startCamera() {
  if (!stream) {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  }
}

function countdown(seconds) {
  return new Promise(resolve => {
    let count = seconds;
    countdownDiv.textContent = count;
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        countdownDiv.textContent = count;
      } else {
        clearInterval(interval);
        countdownDiv.textContent = '📸';
        setTimeout(() => {
          countdownDiv.textContent = '';
          resolve();
        }, 500);
      }
    }, 1000);
  });
}

async function startPhotoSequence() {
  capturedPhotos = [];
  for (let i = 0; i < 3; i++) {
    await countdown(3);
    const photo = capturePhoto();
    capturedPhotos.push(photo);
    await new Promise(res => setTimeout(res, 700));
  }
  showPhotos(capturedPhotos);
}

function capturePhoto() {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  if (selectedFilter !== 'none') {
    ctx.filter = selectedFilter;
  }
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/png');
}

function showPhotos(photos) {
  cameraSection.style.display = 'none';
  filterSelection.style.display = 'none';
  photosSection.style.display = 'block';
  photosDiv.innerHTML = '';
  photos.forEach((src, index) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Photo ${index + 1}`;
    photosDiv.appendChild(img);
  });
}

function savePhotos() {
  capturedPhotos.forEach((photoData, index) => {
    const link = document.createElement('a');
    link.download = `photobooth_photo_${index + 1}.png`;
    link.href = photoData;
    link.click();
  });
}

saveBtn.onclick = savePhotos;

restartBtn.onclick = () => {
  photosSection.style.display = 'none';
  startBtn.style.display = 'block';
  // Reset filter selection
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  selectedFilter = 'none';
  video.style.filter = 'none';
  capturedPhotos = [];
  // Remove sliding animation class
  cameraSection.classList.remove('show');
}; 