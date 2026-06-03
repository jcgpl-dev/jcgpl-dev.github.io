const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const closeChat = document.getElementById('close-chat');
const chatInput = document.getElementById('chat-input');
const chatHistory = document.getElementById('chat-history');
const sendBtn = document.getElementById('send-btn');

const SUPABASE_FUNCTION_URL = 'https://yyfifnhhwstcwqraynci.supabase.co/functions/v1/portfolio-chat';

// Toggle Chat Visibility
chatToggle.addEventListener('click', () => {
    chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
});
closeChat.addEventListener('click', () => { 
    chatWindow.style.display = 'none'; 
});

// Send Message Handler
async function handleSend() {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Append user message
    chatHistory.innerHTML += `
        <div style="align-self: flex-end; background: #007bff; color: white; padding: 8px 12px; border-radius: 12px; max-width: 80%;">
            ${userMessage}
        </div>
    `;
    chatInput.value = '';
    chatHistory.scrollTop = chatHistory.scrollHeight;

    // Show typing loader
    const loadingId = 'loading-' + Date.now();
    chatHistory.innerHTML += `
        <div id="${loadingId}" style="align-self: flex-start; background: #e9ecef; color: #777; padding: 8px 12px; border-radius: 12px; font-style: italic;">
            Typing...
        </div>
    `;
    chatHistory.scrollTop = chatHistory.scrollHeight;

    try {
       const response = await fetch(SUPABASE_FUNCTION_URL, {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: userMessage }) 
});
        
        const data = await response.json();
        document.getElementById(loadingId).remove();

        // Append AI response
        chatHistory.innerHTML += `
            <div style="align-self: flex-start; background: #e9ecef; color: #333; padding: 8px 12px; border-radius: 12px; max-width: 80%;">
                ${data.reply}
            </div>
        `;
    } catch (error) {
        document.getElementById(loadingId).remove();
        chatHistory.innerHTML += `
            <div style="align-self: flex-start; background: #dc3545; color: white; padding: 8px 12px; border-radius: 12px;">
                Error: Unable to connect right now.
            </div>
        `;
    }
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

sendBtn.addEventListener('click', handleSend);
chatInput.addEventListener('keypress', (e) => { 
    if (e.key === 'Enter') handleSend(); 
});