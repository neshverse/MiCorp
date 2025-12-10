
document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selection ---
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const inputArea = document.getElementById('chatbot-input-area');
    const chatbotHeader = document.getElementById('chatbot-header');

    // --- Basic Check ---
    if (!chatbotToggle || !chatbotWindow || !chatbotClose || !chatbotMessages || !chatbotInput || !chatbotSend || !inputArea) {
        if (chatbotToggle) chatbotToggle.style.display = 'none';
        return;
    }

    // --- Add Restart Button to Header dynamically if not present ---
    let restartBtn = document.getElementById('chatbot-restart');
    if (!restartBtn && chatbotHeader) {
        const titleSpan = chatbotHeader.querySelector('span');
        restartBtn = document.createElement('button');
        restartBtn.id = 'chatbot-restart';
        restartBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
        restartBtn.title = "Restart Chat";
        // Insert after title, before close button
        chatbotHeader.insertBefore(restartBtn, chatbotClose);
        restartBtn.addEventListener('click', () => restartConversation());
    }

    // Add quick contact actions to header (Call, Email, WhatsApp)
    let headerActions = document.getElementById('chatbot-header-actions');
    if (!headerActions && chatbotHeader) {
        headerActions = document.createElement('div');
        headerActions.id = 'chatbot-header-actions';
        headerActions.className = 'chatbot-header-actions';
        headerActions.innerHTML = `
            <a href="tel:+971503294310" title="Call us" class="chat-action" aria-label="Call"><i class="fas fa-phone"></i></a>
            <a href="mailto:info@micorptrd.com" title="Email us" class="chat-action" aria-label="Email"><i class="fas fa-envelope"></i></a>
            <a href="https://wa.me/971503294310" target="_blank" rel="noopener" title="WhatsApp" class="chat-action" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
        `;
        chatbotHeader.insertBefore(headerActions, restartBtn);
    }

    // --- State Management ---
    let conversationState = 'initial';
    let collectedData = {};
    let isBotTyping = false;

    // --- Initial Bot Messages & Options ---
    const initialMessage = "Hello! Welcome to Micorp Trading LLC. How can we help today?";
    // include small icons to make options more scannable
    const initialOptions = [
        { text: "Electronics", value: "electronics", icon: 'fa-tv' },
        { text: "IT Products", value: "it_products", icon: 'fa-desktop' },
        { text: "Automobiles", value: "automobiles", icon: 'fa-car-side' },
        { text: "Machinery", value: "machinery", icon: 'fa-industry' },
        { text: "Hardware & Tools", value: "hardware", icon: 'fa-wrench' },
        { text: "Medical", value: "medical", icon: 'fa-stethoscope' },
        { text: "Furniture", value: "furniture", icon: 'fa-couch' },
        { text: "Chat on WhatsApp", value: "whatsapp", icon: 'fa-whatsapp', iconPrefix: 'fab' },
        { text: "General Inquiry", value: "general", icon: 'fa-question-circle' }
    ];

    // --- Utility Functions ---
    const sanitizeHTML = (str) => {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    };

    const scrollToBottom = () => {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    };
    
    const setInputAreaDisabled = (disabled) => {
        chatbotInput.disabled = disabled;
        chatbotSend.disabled = disabled;
        inputArea.style.opacity = disabled ? 0.7 : 1;
        inputArea.style.pointerEvents = disabled ? 'none' : 'auto';
    };

    // --- Chatbot UI Functions ---
    const addMessage = (text, sender, options = null) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chatbot-message', sender);
        messageDiv.innerHTML = text; 

        if (options && Array.isArray(options) && options.length > 0) {
            const optionsDiv = document.createElement('div');
            optionsDiv.classList.add('chatbot-options');
            options.forEach(opt => {
                const button = document.createElement('button');
                button.classList.add('chatbot-option-button');
                // add optional icon
                if (opt.icon) {
                    const i = document.createElement('i');
                    const prefix = opt.iconPrefix || 'fas';
                    i.className = `${prefix} ${opt.icon}`;
                    button.appendChild(i);
                }
                const span = document.createElement('span');
                span.textContent = opt.text;
                button.appendChild(span);
                button.dataset.value = opt.value;
                // remove only this options div when clicked
                button.addEventListener('click', () => {
                    if (optionsDiv && optionsDiv.parentElement) optionsDiv.remove();
                    setInputAreaDisabled(false);
                    handleOptionClick(opt.value, opt.text);
                });
                optionsDiv.appendChild(button);
            });
            messageDiv.appendChild(optionsDiv);
            setInputAreaDisabled(true);
        }
        
        chatbotMessages.appendChild(messageDiv);
        scrollToBottom();
        return messageDiv;
    };
    
    const showTypingIndicator = () => {
        if (isBotTyping) return;
        isBotTyping = true;
        const typingDiv = addMessage('<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>', 'bot');
        typingDiv.classList.add('typing-indicator');
        return typingDiv;
    };

    const hideTypingIndicator = () => {
        const indicator = chatbotMessages.querySelector('.typing-indicator');
        if (indicator) indicator.remove();
        isBotTyping = false;
    };

    const addBotMessageWithTyping = (text, options = null) => {
        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();
            addMessage(text, 'bot', options);
        }, 800 + Math.random() * 400); 
    };

    const addUserMessage = (text) => {
        addMessage(sanitizeHTML(text), 'user');
    };

    const restartConversation = () => {
        chatbotMessages.innerHTML = '';
        conversationState = 'initial';
        collectedData = {};
        setInputAreaDisabled(true);
        addBotMessageWithTyping(initialMessage, initialOptions);
    };

    // --- Event Handlers ---
    chatbotToggle.addEventListener('click', () => {
        const isActive = chatbotWindow.classList.toggle('active');
        chatbotToggle.setAttribute('aria-expanded', isActive);
        if (isActive && chatbotMessages.children.length === 0) {
            restartConversation();
        }
    });

    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
        chatbotToggle.setAttribute('aria-expanded', 'false');
    });

    const handleSend = () => {
        const userText = chatbotInput.value.trim();
        if (userText) {
            addUserMessage(userText);
            processUserInput(userText);
            chatbotInput.value = '';
        }
    };
    chatbotSend.addEventListener('click', handleSend);
    chatbotInput.addEventListener('keypress', (e) => (e.key === 'Enter') && handleSend());

    const handleOptionClick = (value, text) => {
        addUserMessage(text);
        // direct actions
        if (value === 'whatsapp') {
            addBotMessageWithTyping("Click to open WhatsApp:", [{ text: 'Open WhatsApp', value: 'open_whatsapp', icon: 'fa-whatsapp', iconPrefix: 'fab' }, { text: 'Main Menu', value: 'restart', icon: 'fa-home' }]);
            return;
        }
        if (value === 'open_whatsapp') {
            window.open('https://wa.me/971503294310', '_blank');
            addBotMessageWithTyping('Opened WhatsApp for you. Anything else?', [{ text: 'Main Menu', value: 'restart' }]);
            return;
        }
        if (value === 'restart') {
            restartConversation();
            return;
        }

        processUserInput(value);
    };
    
    // --- Conversation Logic ---
    const processUserInput = (input) => {
        const lowerInput = input.toLowerCase();

        if (lowerInput === 'restart' || lowerInput === 'start over') {
            restartConversation();
            return;
        }

        switch (conversationState) {
            case 'initial':
                if (lowerInput === 'whatsapp') {
                    addBotMessageWithTyping("Click the link to chat with us directly: <a href='https://wa.me/971503294310' target='_blank' rel='noopener noreferrer'>Open WhatsApp</a>.", [{ text: 'Main Menu', value: 'restart' }]);
                    conversationState = 'finished';
                } else {
                    // All product inquiries flow here
                    collectedData.inquiryType = input; 
                    addBotMessageWithTyping("Excellent choice. May I have your name to proceed?");
                    conversationState = 'ask_name';
                }
                break;

            case 'ask_name':
                collectedData.name = input;
                addBotMessageWithTyping(`Nice to meet you, ${sanitizeHTML(collectedData.name)}. What is your email address so we can send you the details?`);
                conversationState = 'ask_email';
                break;

            case 'ask_email':
                if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
                    collectedData.email = input;
                    addBotMessageWithTyping(`Thank you. Please describe your specific requirements for ${collectedData.inquiryType}.`);
                    conversationState = 'collect_message';
                } else {
                    addBotMessageWithTyping("That email doesn't look quite right. Please try again.");
                }
                break;

            case 'collect_message':
                collectedData.message = input;
                const summary = `<strong>Confirm Details:</strong><br>
                               Name: ${sanitizeHTML(collectedData.name)}<br>
                               Email: ${sanitizeHTML(collectedData.email)}<br>
                               Interest: ${sanitizeHTML(collectedData.inquiryType)}`;
                addBotMessageWithTyping(summary, [
                    { text: 'Send Inquiry', value: 'submit' },
                    { text: 'Restart', value: 'restart' }
                ]);
                conversationState = 'confirm_submission';
                break;

            case 'confirm_submission':
                if (lowerInput === 'submit') {
                    sendDataToBackend(collectedData);
                } else {
                    restartConversation();
                }
                break;
                
            case 'finished':
                addBotMessageWithTyping("Can I help with anything else?", [{ text: 'Main Menu', value: 'restart' }]);
                break;
        }
    };

    // --- Backend Submission ---
    async function sendDataToBackend(data) {
        setInputAreaDisabled(true);
        const submissionMessage = addMessage("<i>Sending...</i>", 'bot');
        const formspreeEndpoint = 'https://formspree.io/f/meokpzlj';

        const formDataForSpree = new FormData();
        formDataForSpree.append('_subject', `New Chatbot Lead: ${data.inquiryType}`);
        formDataForSpree.append('_replyto', data.email);  // Critical: tells Formspree where to send replies
        formDataForSpree.append('name', data.name);
        formDataForSpree.append('email', data.email);  // Critical: Formspree notifies this address
        formDataForSpree.append('category', data.inquiryType);
        formDataForSpree.append('message', data.message);

        try {
            const response = await fetch(formspreeEndpoint, {
                method: 'POST',
                body: formDataForSpree,
                headers: { 'Accept': 'application/json' }
            });
            
            submissionMessage.remove();
            setInputAreaDisabled(false);

            if (response.ok) {
                addBotMessageWithTyping(`✓ Request Sent! We will contact you at ${sanitizeHTML(data.email)} shortly.`);
                setTimeout(() => {
                    addBotMessageWithTyping("Anything else?", [{ text: 'Main Menu', value: 'restart' }]);
                    conversationState = 'finished';
                }, 1500);
            } else {
                const errorDetails = await response.json().catch(() => ({}));
                console.error('Formspree error:', errorDetails);
                addBotMessageWithTyping("There was an issue sending your request. Please email us at info@micorptrd.com.");
            }
        } catch (error) {
            submissionMessage.remove();
            setInputAreaDisabled(false);
            console.error('Submission error:', error);
            addBotMessageWithTyping("Network error. Please try again later or email info@micorptrd.com.");
        }
    }
});
