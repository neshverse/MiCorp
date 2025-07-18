document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selection ---
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const inputArea = document.getElementById('chatbot-input-area');

    if (!chatbotToggle || !chatbotWindow || !chatbotClose || !chatbotMessages || !chatbotInput || !chatbotSend || !inputArea) {
        if (chatbotToggle) chatbotToggle.style.display = 'none';
        console.error("Chatbot elements not found. Chatbot disabled.");
        return;
    }

    // --- State Management ---
    let conversationState = 'initial';
    let collectedData = {};
    let isBotTyping = false;

    const initialMessage = "Hello! I'm the Micorp Bot. How can I assist you today?";
    const initialOptions = [
        { text: "Product Inquiry", value: "product_inquiry" },
        { text: "Chat on WhatsApp", value: "whatsapp" },
        { text: "Leave a Message", value: "leave_message" }
    ];

    const sanitizeHTML = (str) => {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    };
    const scrollToBottom = () => { chatbotMessages.scrollTop = chatbotMessages.scrollHeight; };
    const setInputAreaDisabled = (disabled) => {
        chatbotInput.disabled = disabled;
        chatbotSend.disabled = disabled;
        inputArea.style.opacity = disabled ? 0.6 : 1;
        inputArea.style.pointerEvents = disabled ? 'none' : 'auto';
    };

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
                button.textContent = opt.text;
                button.dataset.value = opt.value;
                button.addEventListener('click', () => handleOptionClick(opt.value, opt.text));
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
        }, 1000 + Math.random() * 500);
    };
    const addUserMessage = (text) => { addMessage(sanitizeHTML(text), 'user'); };
    const restartConversation = () => {
        chatbotMessages.innerHTML = '';
        conversationState = 'initial';
        collectedData = {};
        setInputAreaDisabled(true);
        addBotMessageWithTyping(initialMessage, initialOptions);
    };
    
    const showWelcomeMessage = () => {
        if (chatbotWindow.classList.contains('active') || document.getElementById('chatbot-welcome-message')) return;
        const fabContainer = chatbotToggle.parentElement;
        const welcomeMessage = document.createElement('div');
        welcomeMessage.id = 'chatbot-welcome-message';
        welcomeMessage.className = 'chatbot-welcome-message';
        welcomeMessage.innerHTML = '<p>Hi! How can I help you?</p>';
        fabContainer.prepend(welcomeMessage);
        setTimeout(() => welcomeMessage.classList.add('visible'), 10);
    };

    const hideWelcomeMessage = () => {
        const msg = document.getElementById('chatbot-welcome-message');
        if (msg) {
            msg.classList.remove('visible');
            msg.addEventListener('transitionend', () => msg.remove(), { once: true });
        }
    };

    chatbotToggle.addEventListener('mouseenter', () => { if (!chatbotWindow.classList.contains('active')) showWelcomeMessage(); });
    chatbotToggle.addEventListener('mouseleave', hideWelcomeMessage);
    chatbotToggle.addEventListener('click', () => {
        hideWelcomeMessage();
        const isActive = chatbotWindow.classList.toggle('active');
        chatbotToggle.setAttribute('aria-expanded', isActive);
        if (isActive && chatbotMessages.children.length === 0) restartConversation();
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
        const optionsContainer = chatbotMessages.querySelector('.chatbot-options');
        if (optionsContainer) optionsContainer.remove();
        addUserMessage(text);
        setInputAreaDisabled(false);
        processUserInput(value);
    };
    
    const processUserInput = (input) => {
        const lowerInput = input.toLowerCase();
        if (lowerInput === 'restart' || lowerInput === 'start over') {
            restartConversation();
            return;
        }
        switch (conversationState) {
            case 'initial':
                if (lowerInput === 'whatsapp') {
                    addBotMessageWithTyping("Great! Click the link to start a chat with us on WhatsApp: <a href='https://wa.me/971503294310' target='_blank' rel='noopener noreferrer'>Open WhatsApp</a>.", [{ text: 'Start Over', value: 'restart' }]);
                    conversationState = 'finished';
                } else if (lowerInput === 'product_inquiry' || lowerInput === 'leave_message') {
                    collectedData = { inquiryType: lowerInput === 'product_inquiry' ? 'Product Inquiry' : 'General Message' };
                    addBotMessageWithTyping("Sure, I can help with that. What's your name?");
                    conversationState = 'ask_name';
                }
                break;
            case 'ask_name':
                collectedData.name = input;
                addBotMessageWithTyping(`Thanks, ${sanitizeHTML(collectedData.name)}. What is your email address?`);
                conversationState = 'ask_email';
                break;
            case 'ask_email':
                if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
                    collectedData.email = input;
                    addBotMessageWithTyping("Great. What is your question or message for our team?");
                    conversationState = 'collect_message';
                } else {
                    addBotMessageWithTyping("That doesn't look like a valid email. Please enter a correct email address.");
                }
                break;
            case 'collect_message':
                collectedData.message = input;
                const summary = `Thank you! Please review the information below:<br><br>
                               <strong>Name:</strong> ${sanitizeHTML(collectedData.name)}<br>
                               <strong>Email:</strong> ${sanitizeHTML(collectedData.email)}<br>
                               <strong>Message:</strong> ${sanitizeHTML(collectedData.message)}`;
                addBotMessageWithTyping(summary, [
                    { text: 'Yes, Submit It', value: 'submit' },
                    { text: 'No, Start Over', value: 'restart' }
                ]);
                conversationState = 'confirm_submission';
                break;
            case 'confirm_submission':
                if (lowerInput === 'submit') {
                    sendDataToBackend(collectedData);
                } else if (lowerInput === 'restart') {
                    addBotMessageWithTyping("Okay, let's start over from the beginning.", []);
                    setTimeout(restartConversation, 1500);
                }
                break;
            case 'finished':
                addBotMessageWithTyping("Is there anything else I can help you with?", [{ text: 'Start a New Inquiry', value: 'restart' }]);
                break;
        }
    };

    async function sendDataToBackend(data) {
        setInputAreaDisabled(true);
        const submissionMessage = addMessage("<i>Submitting your request...</i>", 'bot');
        
        // IMPORTANT: Make sure this endpoint URL is correct from your Formspree account.
        const formspreeEndpoint = 'https://formspree.io/f/mldnollk'; 
        
        const formDataForSpree = new FormData();
        formDataForSpree.append('_subject', `New Chatbot Lead: ${data.inquiryType}`);
        formDataForSpree.append('Name', data.name);
        formDataForSpree.append('Email', data.email);
        formDataForSpree.append('_replyto', data.email);
        formDataForSpree.append('Inquiry Type', data.inquiryType);
        formDataForSpree.append('Message', data.message);
        formDataForSpree.append('_Source Page', window.location.href);

        try {
            const response = await fetch(formspreeEndpoint, { 
                method: 'POST', 
                body: formDataForSpree, 
                headers: { 'Accept': 'application/json' } 
            });

            submissionMessage.remove(); 
            
            if (response.ok) {
                addMessage(`✅ Success! Your message has been sent. Our team will get back to you at ${sanitizeHTML(data.email)} soon.`, 'bot');
            } else {
                const errorData = await response.json();
                console.error("Formspree submission failed:", errorData);
                let userErrorMessage = "❌ Apologies, there was an error sending your message. The server responded with a problem.";
                if (errorData && errorData.error) {
                     userErrorMessage += ` (Details: ${errorData.error})`;
                }
                addMessage(userErrorMessage + " Please try again or contact us directly.", 'bot');
            }
        } catch (error) {
            console.error('Network error during submission:', error);
            submissionMessage.remove(); 
            addMessage("❌ A network error occurred while sending your message. Please check your internet connection and try again.", 'bot');
        } finally {
            setTimeout(() => {
                addBotMessageWithTyping("Is there anything else I can assist with?", [{ text: 'Start New Inquiry', value: 'restart' }]);
                conversationState = 'finished';
            }, 1500);
        }
    }
});