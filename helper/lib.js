exports.joinRooms = joinRooms;
exports.processCommand = processCommand;

var ircServer;

function joinRooms(rooms, ircRef){
    ircServer =  ircRef;
    for (var roomId = 0; roomId < rooms.length; roomId++) {
        room = rooms[roomId];
        if(room){
            ircRef.send('JOIN ' + room);
            console.log("Joined : " + room);
        }
    }
}

function processCommand(message, user){
    switch (message) {
        case "!last":
            return "LastFM requested";
            break;
        case "!score":
        // TODO : Implement
            return "The Score Is 0-0";
        break
        case "!quit":
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