const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//get username and room from URL
//qs.parse takes in url and returns object with username and room
const { username, room } = Qs.parse(location.search, {
    // ignore ? in url
    ignoreQueryPrefix: true,
  });

//connect to socket.io
const socket = io();

//join chatroom
socket.emit('joinRoom', { username, room });

//get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});
//get message from server
socket.on('message', message => {
    console.log(message);
    oututMessage(message);
    //scroll down when new message are received
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// submits message
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

//add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

//add users to DOM
function outputUsers(users) {
    //takes array of users and maps through it, returns li with usernames
    //outputs li with username for each user, joins array together
    //turning array into string and outputting it
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}