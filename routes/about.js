const express = require('express');
const router = express.Router();
const chrono = require('../bin/widgets/chrono');
const meteo = require('../bin/widgets/meteo');
const youtubeChannel = require('../bin/widgets/youtube_channel');
const steamGame = require('../bin/widgets/steam_game');
const steamUser = require('../bin/widgets/steam_user');
const github = require('../bin/widgets/github');
const requestIp = require('request-ip');


/* GET home page. */
router.get('/', function (req, res, next) {

    res.json(
        {
            "client" : {
                "host" :  requestIp.getClientIp(req)
},
            "server" : {
                "current_time" : Math.floor(new Date() / 1000),
                "services" : [
                    {
                        "name" : "weather",
                        "widgets" : [meteo.about, chrono.about]
                    },
                    {
                        "name" : "youtube",
                        "widgets" : [youtubeChannel.about]
                    },
                    {
                        "name" : "steam",
                        "widgets" : [steamUser.about, steamGame.about]
                    },
                    {
                        "name" : "github",
                        "widgets" : [github.about]
                    }
                ]
            }
        });
});

module.exports = router;
