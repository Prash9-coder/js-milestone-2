const socket = io();

document.getElementById('sendButton').addEventListener('click', () => {
    const room = document.getElementById('room').value;
    const message = document.getElementById('messageInput').value;
    socket.emit('chat message', { room, message });
});

socket.on('chat message', (msg) => {
    const chatDiv = document.getElementById('chat');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${msg.room}: ${msg.message}`;
    chatDiv.appendChild(messageElement);
});
