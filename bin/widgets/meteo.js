const request = require('request');
const hbs = require("hbs");
const imageFinder = require('../image_finder');

let apiKey = 'e5b20979253b9bd044aa9dd9ee8d0364';
let widgetPictures = [];

const genWidget = (socket, event, key, start) => {
    let city = event.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    request(url, function (err, response, body) {
        if(err) {
            if (start)
                socket.emit('meteo-city-check', {err : true, message : err, key : key});
        } else {
            let json = JSON.parse(body);
            if (json.cod != 200) {
                if (start)
                    socket.emit('meteo-city-check', {err : true, message : json.message, key : key});
                return;
            }
            if (start)
                socket.emit('meteo-city-check', {err : false, message : '', key : key});
            const source = '{{>meteo_widget}}';
            const template = hbs.compile(source);
            const html = template({
                key : key,
                city : json.name,
                weather : json.weather[0].main,
                temp : json.main.temp,
                humidity : json.main.humidity,
                wind : json.wind.speed,
                city_image : imageFinder.google(json.name + ' city', 'imgSize=large'),
                weather_image : imageFinder.google(json.weather[0].main + ' weather icon', '')
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
        "name" : "city weather",
        "description" : "Affiche la meteo dans une ville donnée",
        "params" : [
            {
                "name" : "city",
                "type" : "string",
            },
            {
                "name" : "frequency",
                "type" : "integer"
            }]
    };

module.exports = { genWidget, about };