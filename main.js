var irc = require("irc-connect");
var helper = require('./helper/lib.js');
var dataStore = require('./datastore');

// TODO: Add to configuration file. 
var ircOptions = {
    channels: ["#hd-torrents", "#tadass"],
    // Defaults to 6667
    port: 6667,
    pass: "sakura123$",
    secure: false,
    nick: 'slut',
    realname: 'BotNickRealName',
    ident: 'Ident'
}

irc.connect('irc.digitalirc.org', ircOptions)
    //include some plugins 
    .use(irc.pong, irc.names, irc.motd)
    //fires when the servers sends the welcome message (RPL_WELCOME) 
    .on('welcome', function (msg) {
        // console.log(msg);
        this.nick(ircOptions.nick, ircOptions.pass, function (err) {
            console.log('There was a problem setting your NICK:', err);
        });
    })
    //fires after the server confirms password 
    // .on('identified', function (nick) {
    //     this.send('JOIN #hd-torrents hdtskeyforirc2021');
    // })
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
        // If registered
        if (mode.params[1] == '+r') {
            console.log("Identified nick");
            // HDTS Passkey addition
            // this.send('JOIN #hd-torrents hdtskeyforirc2021');

            // this.send('JOIN #tester');
            console.log(helper);
            helper.joinRooms(ircOptions.channels, this);
            this.send('JOIN ' + ircOptions.channels[0]);
        }
        console.log(mode);
    })
    .on('PRIVMSG', function (event) {
        var params = event.params;
        
        // if we have a cmd - process it
        if (params[1][0] == ".") {
            console.log("We have a command");
            var response = helper.processCommand(params, event.nick, this);
            if (response == "Quit") {
                this.send('QUIT : Bye, off to service tadas ballz');
            }
            if(response == 'INVITE_OK'){
                console.log('Inviting tadas');
                console.log(event);

                this.send('INVITE', 'tadasbot', 'tadas', 'invited');
            }
            this.send('PRIVMSG ' + params[0] + ' :' + response);
        }

        // Otherwise check for messages. 
        dataStore.getMessage(event.nick);

        // console.log('message from: ' + event.nick, 'to: ' + params[0], params[1]);
    })
    //from the `names` plugin. 
    .on('names', function (cname, names) {
        console.log(cname, names);
    })
    //from the `motd` plugin. 
    .on('motd', function (event) {
        // console.log(this.motd);
        // console.log(this.support);
    })
    .on('message', function (details) {
        console.log("PM RECIEVED 1 mode lowercase");
        // console.log(details);
    })
    .on('MESSAGE', function (details) {
        console.log("PM RECIEVED");
        // console.log(details);
    })
    .on('INVITE', function(details) {
        // console.log(details);
        // join params[1]
        this.send('PRIVMSG', details.params[0], "Thanks for the invite!");
        // Command: PRIVMSG
        // Parameters: <receiver>{,<receiver>} <text to be sent>
        this.send('JOIN ' + details.params[1]);
        console.log("INVITE RECIEVED");
    });
