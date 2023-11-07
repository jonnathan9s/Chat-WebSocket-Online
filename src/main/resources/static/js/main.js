'use strict';

// Obtenemos referencias a elementos del DOM
var nombreDeUsuarioPage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var nombreDeUsuarioForm = document.querySelector('#nombreDeUsuarioForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');

// Cliente STOMP y nombre de usuario
var stompClient = null;
var nombreDeUsuario = null;

// Colores para avatares
var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

// Función para conectar al servidor WebSocket
function connect(event) {
    nombreDeUsuario = document.querySelector('#name').value.trim();

    if (nombreDeUsuario) {
        nombreDeUsuarioPage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        var socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}

// Callback al conectarse con éxito
function onConnected() {
    // Suscribirse al tema público
    stompClient.subscribe('/topic/public', onMessageReceived);

    // Informar al servidor sobre el nombre de usuario
    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({ sender: nombreDeUsuario, type: 'JOIN' })
    );

    connectingElement.classList.add('hidden');
}

// Callback en caso de error de conexión
function onError(error) {
    connectingElement.textContent = 'No se pudo conectar al servidor WebSocket. ¡Actualice esta página para volver a intentarlo!';
    connectingElement.style.color = 'red';
}

// Función para enviar un mensaje
function sendMessage(event) {
    var messageContent = messageInput.value.trim();
    if (messageContent && stompClient) {
        var chatMessage = {
            sender: nombreDeUsuario,
            content: messageInput.value,
            type: 'CHAT'
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}

// Callback al recibir un mensaje
function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');

    if (message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' Se ha unido al chat!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' Abandonó el chat!';
    } else {
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        var nombreDeUsuarioElement = document.createElement('span');
        var nombreDeUsuarioText = document.createTextNode(message.sender);
        nombreDeUsuarioElement.appendChild(nombreDeUsuarioText);
        messageElement.appendChild(nombreDeUsuarioElement);
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

// Función para obtener un color de avatar basado en el nombre de usuario
function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}

// Agregamos eventos de escucha a los formularios
nombreDeUsuarioForm.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', sendMessage, true);
