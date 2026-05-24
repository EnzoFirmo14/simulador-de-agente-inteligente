document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');

    // Auto-resize textarea
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if (this.value === '') {
            this.style.height = 'auto';
        }
    });

    // Handle Enter key (Shift+Enter for new line)
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    sendBtn.addEventListener('click', sendMessage);

    async function sendMessage() {
        const text = messageInput.value.trim();
        if (!text) return;

        // Reset input
        messageInput.value = '';
        messageInput.style.height = 'auto';

        // Add User Message
        appendMessage(text, 'user');

        // Add Typing Indicator
        const typingId = showTypingIndicator();
        scrollToBottom();

        try {
            // Send request to our simplified backend
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    message: text,
                    modelProvider: document.getElementById('model-select').value
                })
            });

            const data = await response.json();
            
            // Remove typing indicator
            removeElement(typingId);

            if (response.ok && data.success) {
                // Formata o texto simples substituindo quebras de linha por <br> e **texto** por <strong>
                let formattedText = data.reply
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br>');
                
                appendMessageHTML(formattedText, 'system');
            } else {
                appendMessage('Desculpe, ocorreu um erro ao processar sua solicitação: ' + (data.error || 'Erro desconhecido'), 'system');
            }
        } catch (error) {
            removeElement(typingId);
            appendMessage('Erro de conexão. Verifique se o servidor está rodando.', 'system');
        }
        
        scrollToBottom();
    }

    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-msg`;
        
        const icon = sender === 'user' ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-robot"></i>';
        
        msgDiv.innerHTML = `
            <div class="msg-avatar">${icon}</div>
            <div class="msg-content"><p>${escapeHTML(text)}</p></div>
        `;
        
        chatMessages.appendChild(msgDiv);
    }

    function appendMessageHTML(html, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-msg`;
        
        const icon = sender === 'user' ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-robot"></i>';
        
        msgDiv.innerHTML = `
            <div class="msg-avatar">${icon}</div>
            <div class="msg-content"><p>${html}</p></div>
        `;
        
        chatMessages.appendChild(msgDiv);
    }

    function showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message system-msg';
        msgDiv.id = id;
        
        msgDiv.innerHTML = `
            <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="msg-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(msgDiv);
        return id;
    }

    function removeElement(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});
