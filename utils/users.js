const users = [];

const joinRoom = (id, username, room) => {
    const user = {
        id,
        username,
        room
    }
    users.push(user);
    return user;
}

const getUserById = (id) => {
    return users.find( usr => usr.id === id);
}

const getUsersByRoom = (room) => {
    return users.filter( usr => usr.room === room);
}

const leaveRoom = (id) => {
    const usersIndex = users.findIndex(usr => usr.id === id);
    if(usersIndex !== -1){
        return users.splice(usersIndex, 1)[0];
    }
}

module.exports = {
    joinRoom,
    getUserById,
    leaveRoom,
    getUsersByRoom
};