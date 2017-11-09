var irc = require("irc-connect");
var helper = require('./helper/lib.js');
// TODO: Add to configuration file. 
var ircOptions = {
    channels: ["#testChannel"],
    // Defaults to 6667
    port: 6667,
    pass: "password",
    secure: false,
    nick: 'Nick',
    realname: 'BotNickRealName',
    ident: 'Ident'
}

var client = irc.connect('irc.freenode.net', ircOptions)
    //include some plugins 
    .use(irc.pong, irc.names, irc.motd)
    //fires when the servers sends the welcome message (RPL_WELCOME) 
    .on('welcome', function (msg) {
        console.log(msg);
        this.nick(ircOptions.nick, ircOptions.pass, function (err) {
            console.log('There was a problem setting your NICK:', err);
        });
    })
    //fires after the server confirms password 
    .on('identified', function (nick) {
        // this.send('JOIN #pogrindis');
    })
    //fires only when YOUR nick changes 
    .on('nick', function (nick) {
        console.log('Your nick is now:', nick);
    })
    .on('NOTICE', function (event) {
        console.log('NOTICE:', event.params[1]);
    })
    .on('JOIN', function (event) {
        console.log(event.nick, 'joined');
    })
    .on('MODE', function (mode) {
        console.log("MODE CHANGED");
        // If registered
        if (mode.params[1] == '+r') {
            console.log("Identified nick");
            // this.send('JOIN #tester');
            console.log(helper);
            helper.joinRooms(ircOptions.channels, this);
        }
        console.log(mode);
    })
    .on('PRIVMSG', function (event) {
        var params = event.params;
        console.log("MESSAGE RECIEVED AND PARSED");
        if (event.nick == 'adam') {
            // this.send(params[0] );
            // this.send('PRIVMSG '+params[0]+' :Success debug event!');
            console.log(params);
            // Check the message. 
            if (params[1][0] == "!") {
                console.log("We have a command");
                var response = helper.processCommand(params[1], event.nick);
                if (response == "Quit") {
                    this.send('QUIT : B');
                }
                this.send('PRIVMSG ' + params[0] + ' :' + response);
            }
        }

        console.log('message from: ' + event.nick, 'to: ' + params[0], params[1]);
    })
    //from the `names` plugin. 
    .on('names', function (cname, names) {
        console.log(cname, names);
    })
    //from the `motd` plugin. 
    .on('motd', function (event) {
        console.log(this.motd);
        console.log(this.support);
    })
    .on('message', function (details) {
        console.log(details);
    })
    .on('MESSAGE', function (details) {
        console.log(details);
    });