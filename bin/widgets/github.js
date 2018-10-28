const request = require('request');
const hbs = require("hbs");
const GitHub = require('github-api');

let User = false;
let Auth = false;

const connect = (socket, event) => {
    Auth = new GitHub({
        username: event.name,
        password: event.password,
    });
    User = Auth.getUser();
    User.getProfile((err, profile) => {
        if (err != null) {
            socket.emit('github-check', {
                err: true,
                message: 'the account does not exist !'
            });
            User = false;
        }
        else {
            socket.emit('github-check', {err: false, message: ''});
        }
    })

};

const disconect = () => {
    Auth = false;
    User = false;
};

const genWidget = (socket, event, key, start) => {
    User.listRepos((err, repos) => {
        let repo = repos.find( repo => repo.name == event.name);
        if (repo) {
            if (start)
                socket.emit('repo-check', {err : false, message : '', key : key});
            const source = '{{>repo_widget}}';
            const template = hbs.compile(source);
            const html = template({
                key : key,
                name : repo.name,
                size : repo.size,
                private : repo.private,
                fork : repo.forks,
                owner : repo.owner.login,
                language : repo.language,
                watch : repo.watchers
            });
            socket.emit('new-widget',
                {
                    html : html,
                    key : key,
                });
        }
        else {
            if (start)
                socket.emit('repo-check', {err : true, message : 'the repo does not exist !', key : key});
        }
    })
};

const about =
    {
        "name" : "repo git",
        "description" : "affiche les info d'un repo git de l'utilisateur",
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


module.exports = {connect, genWidget, disconect, about};