import { contactData } from "../../data/contact.js";
import { getEnhancedDeviceInfo } from "./utils/deviceInfo.js";

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
  let firebaseServicesPromise;

  function getFirebaseServices() {
    if (!firebaseServicesPromise) {
      firebaseServicesPromise = Promise.all([
        import("https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js"),
        import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"),
      ]).then(([firebaseApp, firestore]) => {
        const app = firebaseApp.initializeApp(firebaseConfig);
        const db = firestore.getFirestore(app);

        return {
          db,
          collection: firestore.collection,
          addDoc: firestore.addDoc,
          serverTimestamp: firestore.serverTimestamp,
        };
      });
    }

    return firebaseServicesPromise;
  }

  const ICONS = {
    phone: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M6.62 10.79a15.1 15.1 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.11.37 2.3.56 3.58.56a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.28.19 2.47.56 3.58a1 1 0 0 1-.24 1.01l-2.2 2.2Z"/></svg>`,
    email: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"/></svg>`,
    github: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.01c-3.34.73-4.04-1.41-4.04-1.41-.54-1.37-1.33-1.74-1.33-1.74-1.09-.74.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.77-1.61-2.67-.3-5.47-1.33-5.47-5.94 0-1.31.47-2.39 1.24-3.23-.13-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23A11.4 11.4 0 0 1 12 6.3c1.01 0 2.03.13 2.98.38 2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.88.12 3.18.77.84 1.24 1.92 1.24 3.23 0 4.62-2.8 5.63-5.48 5.93.43.37.82 1.1.82 2.23v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5"/></svg>`,
    facebook: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.62.77-1.62 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12"/></svg>`,
  // New Status Icons
    success: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
    error: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`,
    loading: `<svg class="spinner" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 4V2C6.48 2 2 6.48 2 12h2c0-4.41 3.59-8 8-8zm0 16v2c5.52 0 10-4.48 10-10h-2c0 4.41-3.59 8-8 8z"/></svg>`
  };



  function renderContactSocials() {
    const heading = document.getElementById("contact-heading");
    const desc = document.getElementById("contact-description");
    const list = document.getElementById("contact-social-list");
    if (!heading || !desc || !list) return;

    heading.textContent = contactData.heading;
    desc.textContent = contactData.description;

    list.innerHTML = contactData.socials
      .map(
        social => `
        <a
          class="contact-social-card"
          href="${social.href}"
          target="${social.href.startsWith("http") ? "_blank" : "_self"}"
          rel="${social.href.startsWith("http") ? "noopener noreferrer" : ""}"
        >
          <span class="contact-social-icon icon-box icon-box-md">${ICONS[social.icon] || ""}</span>
          <span class="contact-social-text">
            <span class="contact-social-label">${social.label}</span>
            <span class="contact-social-value">${social.value}</span>
          </span>
        </a>
      `
      )
      .join("");
  }

  function setupContactForm() {
    const form = document.getElementById("contact-form");
    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");
    const messageInput = document.getElementById("contact-message");
    if (!form || !nameInput || !emailInput || !messageInput) return;

    let statusText = document.getElementById("form-status");
    if (!statusText) {
      statusText = document.createElement("p");
      statusText.id = "form-status";
      statusText.style.marginTop = "14px";
      statusText.style.fontSize = "14px";
      statusText.style.fontWeight = "500";
      // Setup flex layout on the status text wrapper so the icon aligns perfectly next to text
      statusText.style.display = "flex";
      statusText.style.alignItems = "center";
      statusText.style.gap = "8px";
      form.appendChild(statusText);
    }

    const submitBtn = form.querySelector('button[type="submit"]');


    const nameRegex = /^[a-zA-Z\s'.]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const repetitivePattern = /(.)\1{3,}/;

    // Converts text to Title Case 
    const toTitleCase = (str) => {
      return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    // Converts text to Sentence Case 
    const toSentenceCase = (str) => {
      if (!str) return "";
      return str
        .toLowerCase()
        .replace(/(^\s*|[.!?]\s+)([a-z])/g, (match, separator, letter) => separator + letter.toUpperCase());
    };

    // Helper to visually toggle input validity styles
    const setValidity = (inputElement, isValid) => {
      if (inputElement.value.trim() === "") {
        inputElement.style.borderColor = ""; // Reset if empty
      } else if (isValid) {
        inputElement.style.borderColor = "#10b981"; // Success Green
      } else {
        inputElement.style.borderColor = "#ef4444"; // Error Red
      }
    };

    // --- 1. REAL-TIME INLINE VALIDATION (As User Types) ---
    nameInput.addEventListener("input", () => {
      const val = nameInput.value.trim();
      const isValid = val.length >= 2 && nameRegex.test(val) && !repetitivePattern.test(val) && val.toLowerCase() !== "test";
      setValidity(nameInput, isValid);
    });

    emailInput.addEventListener("input", () => {
      const val = emailInput.value.trim();
      const isValid = emailRegex.test(val);
      setValidity(emailInput, isValid);
    });

    messageInput.addEventListener("input", () => {
      const val = messageInput.value.trim();
      const isValid = val.length >= 10 && val.length <= 1000 && !repetitivePattern.test(val);
      setValidity(messageInput, isValid);
    });


    // --- 2. AUTOMATIC FORMATTING (When User Clicks Away / Blurs) ---
    nameInput.addEventListener("blur", () => {
      let val = nameInput.value.trim();
      // Clean up double spaces within the name
      val = val.replace(/\s+/g, ' '); 
      if (val) {
        nameInput.value = toTitleCase(val);
        // Re-trigger validation pass on formatted value
        nameInput.dispatchEvent(new Event('input'));
      }
    });

    emailInput.addEventListener("blur", () => {
      const val = emailInput.value.trim();
      if (val) {
        emailInput.value = val.toLowerCase();
        emailInput.dispatchEvent(new Event('input'));
      }
    });

    messageInput.addEventListener("blur", () => {
      let val = messageInput.value.trim();
      val = val.replace(/\s+/g, ' ');
      if (val) {
        messageInput.value = toSentenceCase(val);
        messageInput.dispatchEvent(new Event('input'));
      }
    });


    // --- 3. FINAL SUBMISSION HANDLER ---
  form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();
      
      const isNameValid = name.length >= 2 && name.length <= 60 && nameRegex.test(name) && !repetitivePattern.test(name);
      const isEmailValid = emailRegex.test(email);
      const isMessageValid = message.length >= 10 && message.length <= 1000 && !repetitivePattern.test(message);

      // Front-end Error Guard
      if (!isNameValid || !isEmailValid || !isMessageValid) {
        statusText.removeAttribute("hidden");
        statusText.innerHTML = `${ICONS.error} <span>Please review your inputs before submitting.</span>`;
        statusText.style.color = "#ef4444";
        return;
      }

      submitBtn.disabled = true;
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = "Sending...";
      
      // Processing / Loading text
      statusText.innerHTML = `${ICONS.loading} <span>Processing message...</span>`;
      statusText.style.color = "var(--muted)";
      statusText.removeAttribute("hidden");

const sendData = async () => {
  const deviceInfo = await getEnhancedDeviceInfo();

  try {
    const ipResponse = await fetch("https://api.ipify.org?format=json");
    if (ipResponse.ok) {
      const { ip } = await ipResponse.json();
      deviceInfo.ip = ip;
    }
  } catch (ipError) {
    console.warn("IP fetch failed");
  }

  try {
    const { db, collection, addDoc, serverTimestamp } = await getFirebaseServices();

    await addDoc(collection(db, "messages"), {
      name: name,
      email: email,
      message: message,
      createdAt: serverTimestamp(),
      metadata: deviceInfo
    });

          // Firebase Success
          statusText.innerHTML = `${ICONS.success} <span>Message sent successfully! I will reach out soon.</span>`;
          statusText.style.color = "#10b981"; 
          
          form.reset();
          nameInput.style.borderColor = "";
          emailInput.style.borderColor = "";
          messageInput.style.borderColor = "";

        } catch (error) {
          console.error("Firebase submit runtime error: ", error);
          // Firebase Error
          statusText.innerHTML = `${ICONS.error} <span>Unable to connect. Please try again later.</span>`;
          statusText.style.color = "#ef4444"; 
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      };

      sendData();
    });
  }
  renderContactSocials();
  setupContactForm();
