const moment = require('moment');

//return an object with username, text and time
function formatMessage(username, text) {
  return {
    username,
    text,
    //output time in format: 12:00 am
    time: moment().format('h:mm a')
  }
}

//export the function
module.exports = formatMessage;