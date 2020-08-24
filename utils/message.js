const moment = require('moment');

const CreateMessage = (username, text) => ({
    username,
    text,
    time: moment().format('h:mm a')
});

module.exports = CreateMessage;