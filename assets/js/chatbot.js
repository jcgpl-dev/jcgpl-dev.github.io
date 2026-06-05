const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const closeChat = document.getElementById('close-chat');
const chatInput = document.getElementById('chat-input');
const chatHistory = document.getElementById('chat-history');
const sendBtn = document.getElementById('send-btn');
const charCounter = document.getElementById('chat-char-counter');
const chatOverlay = document.getElementById('chat-overlay');

const SUPABASE_FUNCTION_URL = 'https://yyfifnhhwstcwqraynci.supabase.co/functions/v1/portfolio-chat';

// Centralized close handler to clean up classes and displays
function handleCloseChat() {
  chatWindow.style.display = 'none'; 
  chatOverlay.style.display = 'none';
  document.body.classList.remove('chat-open'); // Returns desktop/mobile page scroll
  chatToggle.style.display = 'flex'; 
}

// Show Panel Toggles
chatToggle.addEventListener('click', () => {
  const isHidden = chatWindow.style.display === 'none' || chatWindow.style.display === '';
  
  if (isHidden) {
    chatWindow.style.display = 'flex';
    chatOverlay.style.display = 'block'; // Block background taps
    document.body.classList.add('chat-open'); // Freeze background scroll
    chatInput.focus();
    chatToggle.style.display = 'none';
  } 
});

// Close panel via the 'X' button
closeChat.addEventListener('click', handleCloseChat);

// Dismiss chat if user clicks anywhere outside the box on the backdrop overlay
chatOverlay.addEventListener('click', handleCloseChat);

// Character Length Live Monitor
chatInput.addEventListener('input', () => {
  const currentLength = chatInput.value.length;
  charCounter.textContent = `${currentLength}/1000`;
});

// Send Message Handler
async function handleSend() {
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;

  // Append User Bubble wrapped with alignment rows
  chatHistory.innerHTML += `
    <div class="chat-message-row user-msg-row">
      <div class="chat-bubble user">
        ${userMessage}
      </div>
    </div>
  `;
  
  // Clear Input Box & resets char limit node
  chatInput.value = '';
  charCounter.textContent = '0/1000';
  chatHistory.scrollTop = chatHistory.scrollHeight;

  // Display Typing State row styled with your profile avatar reference
  const loadingId = 'loading-' + Date.now();
  chatHistory.innerHTML += `
    <div id="${loadingId}" class="chat-message-row ai-msg-row">
      <div class="chat-msg-author-meta">
        <img src="assets/images/profile.png" alt="Jesie" class="chat-bubble-avatar" />
        <span class="chat-author-name">Jesie Gapol</span>
      </div>
      <div class="chat-bubble loading">
        Typing...
      </div>
    </div>
  `;
  chatHistory.scrollTop = chatHistory.scrollHeight;

  try {
    const response = await fetch(SUPABASE_FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage }) 
    });
    
    const data = await response.json();
    const loader = document.getElementById(loadingId);
    if (loader) loader.remove();

    // Context validation
    let aiAnswer = "";
    if (data.reply) {
      aiAnswer = data.reply;
    } else if (data.error) {
      aiAnswer = `⚠️ Error: ${data.error}`;
    } else if (typeof data === 'string') {
      aiAnswer = data;
    } else {
      aiAnswer = JSON.stringify(data);
    }

    // Append Refactored AI message row containing metadata block
    chatHistory.innerHTML += `
      <div class="chat-message-row ai-msg-row">
        <div class="chat-msg-author-meta">
          <img src="assets/images/profile.png" alt="Jesie" class="chat-bubble-avatar" />
          <span class="chat-author-name">Jesie Gapol</span>
        </div>
        <div class="chat-bubble ai">
          ${aiAnswer}
        </div>
      </div>
    `;
  } catch (error) {
    const loader = document.getElementById(loadingId);
    if (loader) loader.remove();
    
    chatHistory.innerHTML += `
      <div class="chat-message-row ai-msg-row">
        <div class="chat-msg-author-meta">
          <img src="assets/images/profile.png" alt="Jesie" class="chat-bubble-avatar" />
          <span class="chat-author-name">Jesie Gapol</span>
        </div>
        <div class="chat-bubble ai" style="color: var(--error); border: 1px solid var(--error);">
          Error: Unable to process your request at this moment.
        </div>
      </div>
    `;
  }
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

sendBtn.addEventListener('click', handleSend);
chatInput.addEventListener('keypress', (e) => { 
  if (e.key === 'Enter') handleSend(); 
});