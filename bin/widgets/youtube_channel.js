const request = require('request');
const request_sync = require('sync-request');
const hbs = require("hbs");
const imageFinder = require('../image_finder');

const apiKey = 'AIzaSyCYjzDHQx8iFYgsqKULhH1EVgydwACEioQ';

const genWidget = (socket, event, key, start) => {
    let name = event.name;
    let url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&forUsername=${name}&key=${apiKey}`;
    let url_picture = `https://www.googleapis.com/youtube/v3/channels?part=snippet&fields=items%2Fsnippet%2Fthumbnails%2Fdefault&forUsername=${name}&key=${apiKey}`;

    request(url, function (err, response, body) {
        if(err) {
            if (start)
                socket.emit('youtubeChannel-name-check', {err : true, message : err, key : key});
        } else {
            let json = JSON.parse(body);
            if (json.pageInfo.totalResults <= 0) {
                if (start)
                    socket.emit('youtubeChannel-name-check', {err : true, message : 'cannot find this channel', key : key});
                return;
            }
            if (start)
                socket.emit('youtubeChannel-name-check', {err : false, message : '', key : key});

            const source = '{{>youtubeChannel_widget}}';
            const template = hbs.compile(source);
            const html = template({
                key : key,
                name : name,
                picture : imageFinder.youtubeAvatar(name),
                subs : json.items[0].statistics.subscriberCount,
                views : json.items[0].statistics.viewCount,
                video : json.items[0].statistics.videoCount,
            });
            socket.emit('new-widget',
                {
                    html : html,
                    key : key,
                });
        }
    });
};

const about =
    {
        "name" : "youtube channel stats",
        "description" : "Affiche les stats d'une chaine youtube (vues, nb video, abonnés)",
        "params" : [
            {
                "name" : "name",
                "type" : "string",
            },
            {
                "name" : "frequency",
                "type" : "integer"
            }]
    };

module.exports = { genWidget, about };