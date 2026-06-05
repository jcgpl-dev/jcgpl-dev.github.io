const chatToggle   = document.getElementById('chat-toggle');
const chatWindow   = document.getElementById('chat-window');
const closeChat    = document.getElementById('close-chat');
const chatInput    = document.getElementById('chat-input');
const chatHistory  = document.getElementById('chat-history');
const sendBtn      = document.getElementById('send-btn');
const charCounter  = document.getElementById('chat-char-counter');
const chatOverlay  = document.getElementById('chat-overlay');

const SUPABASE_FUNCTION_URL =
  'https://yyfifnhhwstcwqraynci.supabase.co/functions/v1/portfolio-chat';

// ─── Conversation history (multi-turn memory) ────────────────────────────────
// Each entry: { role: "user" | "model", parts: [{ text: string }] }
const conversationHistory = [];

// ─── Sanitize helpers ────────────────────────────────────────────────────────
// Safely sets text content — prevents XSS from user input
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Lightweight formatter for AI replies only:
// converts newlines to <br> and wraps inline code in <code> tags
function formatAIReply(text) {
  // Escape first so no raw HTML from AI reaches the DOM
  let safe = escapeHTML(text);
  // Restore intentional line breaks
  safe = safe.replace(/\n/g, '<br>');
  // Wrap `backtick code` as <code> spans
  safe = safe.replace(/`([^`]+)`/g, '<code>$1</code>');
  return safe;
}

// ─── Panel open / close ──────────────────────────────────────────────────────
function handleCloseChat() {
  chatWindow.style.display  = 'none';
  chatOverlay.style.display = 'none';
  document.body.classList.remove('chat-open');
  chatToggle.style.display  = 'flex';
}

chatToggle.addEventListener('click', () => {
  const isHidden =
    chatWindow.style.display === 'none' || chatWindow.style.display === '';

  if (isHidden) {
    chatWindow.style.display  = 'flex';
    chatOverlay.style.display = 'block';
    document.body.classList.add('chat-open');
    chatInput.focus();
    chatToggle.style.display = 'none';
  }
});

closeChat.addEventListener('click', handleCloseChat);
chatOverlay.addEventListener('click', handleCloseChat);

// ─── Character counter ───────────────────────────────────────────────────────
chatInput.addEventListener('input', () => {
  charCounter.textContent = `${chatInput.value.length}/1000`;
});

// ─── DOM bubble builders (no innerHTML for user content) ─────────────────────
function buildUserBubble(text) {
  const row = document.createElement('div');
  row.className = 'chat-message-row user-msg-row';

  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble user';
  bubble.textContent = text; // ← safe: no HTML parsing

  row.appendChild(bubble);
  return row;
}

function buildAIBubble(htmlContent, isError = false) {
  const row = document.createElement('div');
  row.className = 'chat-message-row ai-msg-row';

  const meta = document.createElement('div');
  meta.className = 'chat-msg-author-meta';
  meta.innerHTML = `
    <img src="assets/images/profile.png" alt="Jesie" class="chat-bubble-avatar" />
    <span class="chat-author-name">Jesie Gapol</span>
  `;

  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble ai' + (isError ? ' chat-bubble--error' : '');
  bubble.innerHTML = htmlContent; // ← AI content only, already sanitized via formatAIReply

  row.appendChild(meta);
  row.appendChild(bubble);
  return row;
}

function buildTypingIndicator(id) {
  const row = document.createElement('div');
  row.className = 'chat-message-row ai-msg-row';
  row.id = id;

  const meta = document.createElement('div');
  meta.className = 'chat-msg-author-meta';
  meta.innerHTML = `
    <img src="assets/images/profile.png" alt="Jesie" class="chat-bubble-avatar" />
    <span class="chat-author-name">Jesie Gapol</span>
  `;

  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble ai chat-bubble--typing';
  // Three animated dots rendered purely via CSS
  bubble.innerHTML = `<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>`;

  row.appendChild(meta);
  row.appendChild(bubble);
  return row;
}

// ─── Send handler ────────────────────────────────────────────────────────────
async function handleSend() {
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;

  // Disable input while waiting
  chatInput.disabled = true;
  sendBtn.disabled   = true;

  // Append user bubble (XSS-safe)
  chatHistory.appendChild(buildUserBubble(userMessage));

  // Reset input
  chatInput.value       = '';
  charCounter.textContent = '0/1000';
  chatHistory.scrollTop   = chatHistory.scrollHeight;

  // Add this turn to history BEFORE sending so the backend sees it
  conversationHistory.push({
    role: 'user',
    parts: [{ text: userMessage }],
  });

  // Show animated typing indicator
  const loadingId  = 'loading-' + Date.now();
  const typingRow  = buildTypingIndicator(loadingId);
  chatHistory.appendChild(typingRow);
  chatHistory.scrollTop = chatHistory.scrollHeight;

  try {
    const response = await fetch(SUPABASE_FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        history: conversationHistory, // ← pass full history for multi-turn memory
      }),
    });

    const data = await response.json();
    document.getElementById(loadingId)?.remove();

    let aiAnswer = '';
    if (data.reply) {
      aiAnswer = data.reply;
    } else if (data.error) {
      aiAnswer = `Sorry, something went wrong: ${data.error}`;
    } else {
      aiAnswer = 'I had trouble responding. Please try again.';
    }

    // Store the model reply in history for next turn
    conversationHistory.push({
      role: 'model',
      parts: [{ text: aiAnswer }],
    });

    // Trim history to last 20 turns to avoid token bloat
    if (conversationHistory.length > 20) {
      conversationHistory.splice(0, conversationHistory.length - 20);
    }

    chatHistory.appendChild(buildAIBubble(formatAIReply(aiAnswer)));
  } catch {
    document.getElementById(loadingId)?.remove();
    chatHistory.appendChild(
      buildAIBubble('Unable to reach the server. Please check your connection and try again.', true)
    );
    // Remove the failed user turn from history so it doesn't corrupt future context
    conversationHistory.pop();
  } finally {
    chatInput.disabled  = false;
    sendBtn.disabled    = false;
    chatInput.focus();
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }
}

sendBtn.addEventListener('click', handleSend);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) handleSend();
});