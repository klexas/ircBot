exports.joinRooms = joinRooms;
exports.processCommand = processCommand;

var dataStore = require('../datastore');

var ircServer;
var self = this;


function joinRooms(rooms, ircRef){
    self.ircServer =  ircRef;
    for (var roomId = 0; roomId < rooms.length; roomId++) {
        room = rooms[roomId];
        joinRoom(room);
    }
}


function joinRoom(room, key){
    self.ircServer.send('JOIN ' + room + ' ' + key);
    console.log("Joined : " + room);
}

function processCommand(message, user, ircRef){
    self.ircServer = ircRef;
    var channel = message[0];
    var cmmand = message[1].split(' ')[0];
    switch (cmmand) {
        case ".last":
            return "LastFM requested";
            break;
        case '.to':
            var messageContent = message[1].replace(cmmand, '');
            var toUser = message[1].split(' ')[1];
            dataStore.leaveMessage(messageContent, user, toUser);
            console.log("Message saved");
            // TODO : Implement
            return "Message saved from " + user;
            break            
        case ".score":
            // TODO : Implement
            return "The Score Is 0-0";
        break
        case ".messages":
            // TODO : Implement
            var messages = dataStore.getMessage('tadas');
            console.log(messages);
            messages.forEach(message => {
                self.ircServer.send('PRIVMSG ' + channel + ' :' + message.message);
            });

            return messages;
        break
        case '.hdts':
            var room = "#hd-torrents";
            var key = "hdtskeyforirc2021";
            joinRoom(room, key);
            break;
        case '.invite':
            // sanitize if it already has a # for room prefix
            var room = "#" + message[1].split(' ')[1];
            console.log("Joining room : " + room);
            joinRoom(room);
            return "INVITE_OK"; 
        break;

        case ".quit":
            if(user.indexOf("tadas") > -1 ){
                // Quit
                console.log("Quit :: Have a nice day");
                return "Quit"
            }
            else{
                return false;
            }
        break;
        default:
            return "Not defined";
            break;
    }
}