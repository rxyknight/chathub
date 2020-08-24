const chatForm = document.getElementById('chat-form');
const chatMessageContainer = document.querySelector('.chat-messages');
const usersContainer = document.getElementById('users');

const socket = io();


const { username, room } = Qs.parse(window.location.search, {
    ignoreQueryPrefix: true
});

document.getElementById('room-name').innerHTML = room;

socket.emit('joinRoom', username, room);


socket.on('updateUserList', users => {
    updateUserList(users);
})

socket.on('message', msg => {
    outputMessage(msg);
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Get message tag
    const msg = e.target.elements.msg.value;

    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


const updateUserList = (users) => {
    usersContainer.innerHTML = users.map(usr => `<li>${usr.username}</li>`).join('');
}


const outputMessage = (message) => {
    
    chatMessageContainer.innerHTML += `
    <div class="message">
        <p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">${message.text}</p>
    </div>`;
    chatMessageContainer.scrollTo(0, chatMessageContainer.scrollHeight);
}