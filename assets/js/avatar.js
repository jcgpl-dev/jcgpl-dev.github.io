const TOTAL_FRAMES = 142;
const FRAME_PATH = "./assets/images/profile_frames_webp";
const avatar = document.getElementById("profile-avatar");

let currentFrame = 1; 
let animationFrameId = null;

function getFramePath(frame) {
  return `${FRAME_PATH}/frame-${String(frame).padStart(3, "0")}.webp`;
}


const preloadedImages = [];
function preloadFrames() {
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = getFramePath(i);
    preloadedImages[i] = img;
  }
}

if (document.readyState === "complete") {
  preloadFrames();
} else {
  window.addEventListener("load", preloadFrames);
}


function animateTo(targetFrame) {

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  if (currentFrame === targetFrame) return;

  const startFrame = currentFrame;
  const frameDistance = Math.abs(targetFrame - startFrame);
  

  const duration = (frameDistance / 30) * 1000; 
  const startTime = performance.now();

  function render(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    

    currentFrame = Math.round(startFrame + (targetFrame - startFrame) * progress);


    if (avatar) {
      avatar.src = preloadedImages[currentFrame] ? preloadedImages[currentFrame].src : getFramePath(currentFrame);
    }

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      animationFrameId = null;
    }
  }

  animationFrameId = requestAnimationFrame(render);
}


export function playForward() {
  animateTo(TOTAL_FRAMES); 
}

export function playBackward() {
  animateTo(1); 
}

export function setDarkFrame() {
  currentFrame = TOTAL_FRAMES;
  if (avatar) avatar.src = getFramePath(TOTAL_FRAMES);
}

export function setLightFrame() {
  currentFrame = 1;
  if (avatar) avatar.src = getFramePath(1);
}