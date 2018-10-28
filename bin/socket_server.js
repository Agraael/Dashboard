const hbs = require("hbs");
const chrono = require('./widgets/chrono');
const meteo = require('./widgets/meteo');
const youtubeChannel = require('./widgets/youtube_channel');
const steamGame = require('./widgets/steam_game');
const steamUser = require('./widgets/steam_user');
const github = require('./widgets/github');

let keyCount = 1;
let widgets = [];

const socketWidget = (socket, event, interval, key, genFunc) => {
    genFunc(socket, event, key, true);
    widgets.push({key : key, routine : setInterval(genFunc, interval * 1000, socket, event, key, false)});
};

exports = module.exports = (io) => {

    io.sockets.on('connection', (socket) => {
        console.log('new connection !!');

        socket.on('remove-widget', (event) => {
            console.log('widget number ' + event.key + ' is removed');
            let widget = widgets.find( widget => widget.key === event.key);
            if (widget)
                clearTimeout(widget.routine);
        });

        /*
        ** socket pour la widget de test chrono
         */
        socket.on('chrono-widget', (event) => {
            console.log('chrono-widget ' + keyCount);
            socketWidget(socket, event, 0.5, keyCount, chrono.genWidget);
            console.log('created !');
            keyCount++;
        });

        /*
        ** socket pour la widget meteo
         */
        socket.on('meteo-widget', (event) => {
            console.log('meteo-widget number ' + keyCount);
            socketWidget(socket, event, event.timer, keyCount, meteo.genWidget);
            console.log('created !');
            keyCount++;
        });

        /*
        ** socket pour la widget youtube channel
         */
        socket.on('youtubeChannel-widget', (event) => {
            console.log('youtubeChannel-widget number ' + keyCount);
            socketWidget(socket, event, event.timer, keyCount, youtubeChannel.genWidget);
            console.log('created !');
            keyCount++;
        });

        socket.on('steamGame-widget', (event) => {
            console.log('youtubeChannel-widget number ' + keyCount);
            socketWidget(socket, event, event.timer, keyCount, steamGame.genWidget);
            console.log('created !');
            keyCount++;
        });

        socket.on('steamUser-widget', (event) => {
            console.log('youtubeChannel-widget number ' + keyCount);
            socketWidget(socket, event, event.timer * 60, keyCount, steamUser.genWidget);
            console.log('created !');
            keyCount++;
        });


        socket.on('github-connect', (event) => {
            github.connect(socket, event);
        });

        socket.on('github-logout', (event) => {
            github.disconect();
        });

        socket.on('repo-widget', (event) => {
            console.log('youtubeChannel-widget number ' + keyCount);
            socketWidget(socket, event, event.timer, keyCount, github.genWidget);
            console.log('created !');
            keyCount++;
        })
    });
};
