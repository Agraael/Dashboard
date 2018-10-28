const request = require('request');
const hbs = require("hbs");

const apiKey = '3BE1A38D2B08D26EAF1613CB0517F940';

const genWidget = (socket, event, key, start) => {
    const userId = event.userId;
    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${userId}`;
    const url_games = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${userId}&format=json&include_appinfo=1`;

    request(url, function (err, response, body) {
        if(err) {
            if (start)
                socket.emit('steamUser-check', {err : true, message : err, key : key});
        } else {
            let json = JSON.parse(body);
            if (json.response.players.length <= 0) {
                if (start)
                    socket.emit('steamUser-check', {err : true, message : 'This user does not exist !', key : key});
            }
            else {
                request(url_games, function (err, response, body) {
                    if(err) {
                        if (start)
                            socket.emit('steamUser-check', {err : true, message : err, key : key});
                    }
                    else {
                        if (start)
                            socket.emit('steamUser-check', {err : false, message : '', key : key});
                        let json_games = JSON.parse(body);
                        const source = '{{>steamUser_widget}}';
                        const template = hbs.compile(source);
                        const html = template({
                            picture: json.response.players[0].avatar,
                            name: json.response.players[0].personaname,
                            number : json_games.response.game_count,
                            games : json_games.response.games,
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
        "name" : "steam user",
        "description" : "affiche les info d'utilisateur et ses jeux",
        "params" : [
            {
                "name" : "user_id",
                "type" : "integer",
            },
            {
                "name" : "frequency",
                "type" : "integer"
            }]
    };

module.exports = {genWidget, about};