const hbs = require("hbs");

const genWidget = (socket, event, key, start) => {
    const d = new Date();
    const source = '{{>chrono_widget}}';
    const template = hbs.compile(source);
    const html = template(
        {
            key : key,
            hours : d.getHours(),
            min : d.getMinutes(),
            sec : d.getSeconds()
        });
    socket.emit('new-widget',
        {
            html : html,
            key : key
        });
    return true;
};
const about =
    {
        "name" : "clock",
        "description" : "Affiche l'heure (widget de test)",
        "params" : []
    };

module.exports = { genWidget, about };