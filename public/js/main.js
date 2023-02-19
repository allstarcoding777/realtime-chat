const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
//get username and room from URL
const { username,room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
console.log(username, room);

const socket = io();
//join chatroom
socket.emit('joinRoom', { username, room });
// message from server
socket.on('message', message => {
    console.log(message);
    oututMessage(message);
    //scroll down when new message are received
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // get message text value
    const msg = e.target.elements.msg.value;
    console.log(msg);
    // emit message to server
    socket.emit('chatMessage', msg);
    //clear input
    e.target.elements.msg.value = '';
    //focus on empty text input
    e.target.elements.msg.focus();
});

// output message to DOM
function oututMessage(message) {
    //create element
    const div = document.createElement('div');
    div.classList.add('message');
    //set innerHTML
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
    ${message.text}
    </p>`;
    //adds new div to chat messages
    document.querySelector('.chat-messages').appendChild(div);
}