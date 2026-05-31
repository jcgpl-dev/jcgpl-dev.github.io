import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

//hehe ayg saba dawg
//yati ka ayaw nig hilabti ba
const firebaseConfig = {
  apiKey: "AIzaSyB8jyKWD7UQMHut3dC6hhn4Zyscao1SrKI",
  authDomain: "jgpl-portfolio.firebaseapp.com",
  projectId: "jgpl-portfolio",
  storageBucket: "jgpl-portfolio.firebasestorage.app",
  messagingSenderId: "909600723116",
  appId: "1:909600723116:web:9267ab12f50f5f2161cf09"
};

//pahawa dire mananap
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function setupCVTracking() {
  const cvLink = document.querySelector('.hero-actions a[download]');
  if (!cvLink) return;

  // REMOVED 'async' from the listener wrapper to ensure older browsers don't stumble
  cvLink.addEventListener("click", () => {
    
    // Read window variables instantly before context blocks change
    const userAgent = navigator.userAgent;
    const windowResolution = `${window.screen.width}x${window.screen.height}`;

    // Isolate the asynchronous collection execution block
    const trackDownload = async () => {
      let ipAddress = "Unknown / Blocked";

      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        if (ipResponse.ok) {
          const ipData = await ipResponse.json();
          ipAddress = ipData.ip;
        }
      } catch (e) {
        console.warn("IP fetch omitted due to client configuration or adblocker.");
      }

      try {
        await addDoc(collection(db, "cv_downloads"), {
          downloadedAt: serverTimestamp(),
          metadata: {
            ip: ipAddress,
            deviceAgent: userAgent,
            screenResolution: windowResolution
          }
        });
        console.log("CV Download metrics logged successfully.");
      } catch (error) {
        console.error("Metrics synchronization failed:", error);
      }
    };

    // Execute the cloud synchronization safely in the background
    trackDownload();
  });
}

setupCVTracking();

// Rotating hero role text
(() => {
  const el = document.querySelector(".hero-role .role-text");
  if (!el) return;

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const roles = ["FLUTTER DEVELOPER", "GRAPHIC DESIGNER"];
  let idx = roles.indexOf(el.textContent?.trim() || "");
  if (idx < 0) idx = 0;

  // If reduced motion, just swap text without fades.
  const intervalMs = prefersReducedMotion ? 2500 : 2800;
  const fadeMs = 220;

  window.setInterval(() => {
    idx = (idx + 1) % roles.length;

    if (prefersReducedMotion) {
      el.textContent = roles[idx];
      return;
    }

    el.classList.remove("fade-in");
    el.classList.add("fade-out");

    window.setTimeout(() => {
      el.textContent = roles[idx];
      el.classList.remove("fade-out");
      el.classList.add("fade-in");
    }, fadeMs);
  }, intervalMs);
})();
