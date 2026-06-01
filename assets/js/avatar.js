const TOTAL_FRAMES = 142;
const FRAME_PATH = "./assets/images/profile_frames_webp";

const avatar = document.getElementById("profile-avatar");

let isAnimating = false;

function getFrame(frame) {
  return `${FRAME_PATH}/frame-${String(frame).padStart(3, "0")}.webp`;
}

// preload
for (let i = 1; i <= TOTAL_FRAMES; i++) {
  const img = new Image();
  img.src = getFrame(i);
}

function playFrames(start, end) {
  if (!avatar || isAnimating) return;

  isAnimating = true;

  const duration = (Math.abs(end - start) / 30) * 1000;

  const startTime = performance.now();

  function animate(now) {
    const progress = Math.min(
      (now - startTime) / duration,
      1
    );

    const frame = Math.round(
      start + (end - start) * progress
    );

    avatar.src = getFrame(frame);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      isAnimating = false;
    }
  }

  requestAnimationFrame(animate);
}

export function playForward() {
  playFrames(1, TOTAL_FRAMES);
}

export function playBackward() {
  playFrames(TOTAL_FRAMES, 1);
}

export function setDarkFrame() {
  if (avatar) avatar.src = getFrame(TOTAL_FRAMES);
}

export function setLightFrame() {
  if (avatar) avatar.src = getFrame(1);
}