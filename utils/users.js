const users = [];

//join user to chat
function userJoin(id, username, room) {
    //create user from params passed in
    const user = { id, username, room };
    //push user to users array
    users.push(user);
    return user;
}

//get current user
function getCurrentUser(id) {
    //returns array of users with matching id
    return users.find(user => user.id === id);
}

// user leaves chat
function userLeave(id) {
    //remove user from user array, will give us the index of the user
    const index = users.findIndex(user => user.id === id);
    //check if index is not -1
    if (index !== -1) {
        //remove user from array and return it
        return users.splice(index, 1)[0];
    }
}

//get room users
function getRoomUsers(room) {
    //filters through user array and returns users with matching room
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};