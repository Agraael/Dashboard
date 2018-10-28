const request = require('request');
const hbs = require("hbs");

const apiKey = '3BE1A38D2B08D26EAF1613CB0517F940';

const genWidget = (socket, event, key, start) => {
    const gameId = event.gameId;
    const url = `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${gameId}`;
    const url_info = `https://store.steampowered.com/api/appdetails?appids=${gameId}`;

    request(url, function (err, response, body) {
        if(err) {
            if (start)
                socket.emit('steamGame-check', {err : true, message : err, key : key});
        } else {
            let json = JSON.parse(body);
            if (json.response.result !== 1) {
                if (start)
                    socket.emit('steamGame-check', {err : true, message : 'This game does not exist !', key : key});
            }
            else {
                request(url_info, function (err, response, body) {
                    if(err) {
                        if (start)
                            socket.emit('steamGame-check', {err : true, message : err, key : key});
                    }
                    else {
                        if (start)
                            socket.emit('steamGame-check', {err : false, message : '', key : key});
                        let json_info = JSON.parse(body);
                        const source = '{{>steamGame_widget}}';
                        const template = hbs.compile(source);
                        const html = template({
                            players: json.response.player_count,
                            picture: `https://steamcdn-a.akamaihd.net/steam/apps/${gameId}/header.jpg`,
                            name: json_info[`${gameId}`].data.name,
                            key: key
                        });
                        socket.emit('new-widget',
                            {
                                html : html,
                                key : key,
                            });
                    }
                });
            }
        }
    });
};

const about =
    {
        "name" : "steam game",
        "description" : "affiche le nombre de joueur sur le jeu",
        "params" : [
            {
                "name" : "game_id",
                "type" : "integer",
            },
            {
                "name" : "frequency",
                "type" : "integer"
            }]
    };

module.exports = {genWidget, about};