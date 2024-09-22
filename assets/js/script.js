document.addEventListener('DOMContentLoaded', function () {
    const conversations = getConversationsData();

    const elements = {
        conversationsList: document.getElementById('conversations-list'),
        chatMessages: document.getElementById('chat-messages'),
        chatUsername: document.getElementById('chat-username'),
        chatProfilePicture: document.getElementById('chat-profile-picture'),
        messageInput: document.getElementById('message-input'),
        sendMessageButton: document.getElementById('send-message-button'),
        showConversationsButton: document.getElementById('show-conversations-button'),
        searchConversationsInput: document.getElementById('search-conversations'), 
        conversationsSidebar: new bootstrap.Collapse(document.getElementById('conversations-sidebar'), { toggle: false })
    };

    // Agregar event listeners
    elements.sendMessageButton.addEventListener('click', sendMessage);
    elements.showConversationsButton.addEventListener('click', toggleConversationsSidebar);
    elements.searchConversationsInput.addEventListener('input', filterConversations);

    // Renderizar las conversaciones
    renderConversations();

    // Función para obtener las conversaciones
    function getConversationsData() {
        return [
            { id: 1, name: 'John Doe', lastMessage: 'Hola!', lastMessageTime: new Date(), unread: true, profilePicture: 'assets/img/johndoe.jpg', messages: [{ text: 'Hola!', sent: false }] },
            { id: 2, name: 'Jane Smith', lastMessage: '¿Cómo estás?', lastMessageTime: new Date(Date.now() - 86400000), unread: false, profilePicture: 'assets/img/jane.jpg', messages: [{ text: '¿Cómo estás?', sent: false }] },
            { id: 3, name: 'Bob Johnson', lastMessage: 'Adiós!', lastMessageTime: new Date(Date.now() - 172800000), unread: true, profilePicture: 'assets/img/bob.jpg', messages: [{ text: 'Adiós!', sent: false }] },
            { id: 4, name: 'Alice Brown', lastMessage: 'Buenos días!', lastMessageTime: new Date(Date.now() - 259200000), unread: false, profilePicture: 'assets/img/alice.jpg', messages: [{ text: 'Buenos días!', sent: false }] },
            { id: 5, name: 'Charlie Davis', lastMessage: '¿Qué tal?', lastMessageTime: new Date(Date.now() - 345600000), unread: true, profilePicture: 'assets/img/charlie.jpg', messages: [{ text: '¿Qué tal?', sent: false }] },
            { id: 6, name: 'Diana Evans', lastMessage: 'Hasta luego!', lastMessageTime: new Date(Date.now() - 432000000), unread: false, profilePicture: 'assets/img/diana.jpg', messages: [{ text: 'Hasta luego!', sent: false }] }
        ];
    }

    function formatTime(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString() ?
            date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
            date.toLocaleDateString();
    }

    // Renderizar la lista de conversaciones
    function renderConversations(filteredConversations = conversations) {
        elements.conversationsList.innerHTML = '';
        filteredConversations.forEach(conversation => {
            const conversationElement = createConversationElement(conversation);
            elements.conversationsList.appendChild(conversationElement);
        });
    }

    // Crear los elementos de la conversación en la lista
    function createConversationElement(conversation) {
        const conversationElement = document.createElement('div');
        conversationElement.className = `list-group-item list-group-item-action ${conversation.unread ? 'fw-bold' : ''}`;
        conversationElement.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">${conversation.name}</h5>
                <small>${formatTime(new Date(conversation.lastMessageTime))}</small>
            </div>
            <p class="mb-1">${conversation.lastMessage}</p>
        `;
        conversationElement.addEventListener('click', () => selectConversation(conversation));
        return conversationElement;
    }

    // Seleccionar y mostrar una conversación
    function selectConversation(conversation) {
        elements.chatUsername.textContent = conversation.name;
        elements.chatProfilePicture.src = conversation.profilePicture;
        elements.chatMessages.innerHTML = '';
        conversation.messages.forEach(msg => {
            const messageElement = createMessageElement(msg);
            elements.chatMessages.appendChild(messageElement);
        });
        if (window.innerWidth <= 768) {
            elements.conversationsSidebar.hide();
        }
        conversation.unread = false;
        renderConversations();
    }

    // Crear elementos de mensaje en el chat
    function createMessageElement(message) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.sent ? 'sent' : 'received'}`;
        messageElement.textContent = message.text;
        return messageElement;
    }

    // Enviar mensaje
    function sendMessage(event) {
        event.preventDefault();
    
        const text = elements.messageInput.value;
        if (text.trim() !== '') {
            const currentConversation = conversations.find(conversation => conversation.name === elements.chatUsername.textContent);
            
            if (currentConversation) {
                currentConversation.messages.push({ text, sent: true });
                const messageElement = createMessageElement({ text, sent: true });
                elements.chatMessages.appendChild(messageElement);
                elements.messageInput.value = '';
                elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
            }
        }
    }

    // Alternar el sidebar de las conversaciones
    function toggleConversationsSidebar() {
        elements.conversationsSidebar.toggle();
    }

    // Filtro de conversaciones por nombre o último mensaje
    function filterConversations() {
        const query = elements.searchConversationsInput.value.toLowerCase();
        const filteredConversations = conversations.filter(conversation =>
            conversation.name.toLowerCase().includes(query) ||
            conversation.lastMessage.toLowerCase().includes(query)
        );
        renderConversations(filteredConversations);
    }

    // Buscar e iniciar conversación por nombre de usuario, esta me funciona a medias, me encuentra el nombre pero cunado hago un even
    //evento ,solo funciona cuando digito parte del nombre, no me funciona usando el boton buscar
    function startConversationByUsername(username) {
        const conversation = conversations.find(convo => convo.name.toLowerCase() === username.toLowerCase());
        if (conversation) {
            selectConversation(conversation);
        } else {
            alert('Conversación no encontrada');
        }
    }
});
