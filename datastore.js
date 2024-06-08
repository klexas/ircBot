var message_list = [];
const data = require('./flat_file.json')

function leaveMessage(message, from, to) {
    console.log({message: message, from: from, to: to});
    message_list.push({message: message, from: from, to: to});
}

function getMessage(reciever) {
    var messages = message_list.filter(x => x.to == reciever);
    // return list of messages. 
    return messages;
}

function checkForMessages(speaker){
    // Early out
    if(message_list.length < 1) return;
    var messages = this.getMessage(speaker);
    if(messages.length > 0)
        return messages;
}

exports.leaveMessage = leaveMessage;
exports.getMessage = checkForMessages;