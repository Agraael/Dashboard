let socket = io.connect('http://localhost:8080');

(function ($) {

    function addWidget(html) {$(html).hide().appendTo("#widget-zone").fadeIn();}
    function rmWidget(id) {$('#widget-' + id).fadeOut(function () {
        $(this).remove();
    });}
    function updateWidget(id, htnl) {$('#widget-' + id).replaceWith(htnl)}

    socket.on('new-widget', (event) => {
        let element = document.getElementById('widget-' + event.key);
        if (element != null)
            updateWidget(event.key, event.html);
        else
            addWidget(event.html);
    });

    $(document).delegate('.widget-close', 'click', function() {
        let key = parseInt(this.id.substring(13));
        rmWidget(key);
        socket.emit('remove-widget', { key : key})
    });

    /*
    ** Chrono widget ----------------------------------------
     */
    $('#add-chrono-widget').click(function(){
        socket.emit('chrono-widget', {})
    });

    /*
    ** Meteo widget ----------------------------------------
     */
    $('#add-meteo-widget').click(function(event){
        event.preventDefault();
        let city = $('#meteo-city').val();
        let timer = $('#meteo-timer').val();
        if (! city || ! timer)
            $('#meteo-err').text('please fill out the required inputs').fadeIn('slow').delay(2500).fadeOut();
        else
            socket.emit('meteo-widget', {city : city, timer : timer});
    });

    socket.on('meteo-city-check', (event) => {
        if (event.err) {
            $('#meteo-err').text(event.message).fadeIn('slow').delay(2500).fadeOut();
            socket.emit('remove-widget', { key : event.key})
        }
        else {
            $('#meteoModal').modal('hide')
        }
    });

    /*
    ** youtube channel ----------------------------------------
     */

    $('#add-youtubeChannel-widget').click(function(event){
        event.preventDefault();
        let name = $('#youtubeChannel-name').val();
        let timer = $('#youtubeChannel-timer').val();
        if (! name || ! timer)
            $('#youtubeChannel-err').text('please fill out the required inputs').fadeIn('slow').delay(2500).fadeOut();
        else
            socket.emit('youtubeChannel-widget', {name : name, timer : timer});
    });
    socket.on('youtubeChannel-name-check', (event) => {
        if (event.err) {
            $('#youtubeChannel-err').text(event.message).fadeIn('slow').delay(2500).fadeOut();
            socket.emit('remove-widget', { key : event.key})
        }
        else {
            $('#youtubeChannelModal').modal('hide')
        }
    });

    /*
    ** steam game widget
     */
    $('#add-steamGame-widget').click(function(event){
        event.preventDefault();
        let gameId = $('#steamGame-id').val();
        let timer = $('#steamGame-timer').val();
        if (! gameId || ! timer)
            $('#steamGame-err').text('please fill out the required inputs').fadeIn('slow').delay(2500).fadeOut();
        else
            socket.emit('steamGame-widget', {gameId : gameId, timer : timer});
    });
    socket.on('steamGame-check', (event) => {
        if (event.err) {
            $('#steamGame-err').text(event.message).fadeIn('slow').delay(2500).fadeOut();
            socket.emit('remove-widget', { key : event.key})
        }
        else {
            $('#steamGameModal').modal('hide')
        }
    });

    /*
   ** steam user widget
    */
    $('#add-steamUser-widget').click(function(event){
        event.preventDefault();
        let userId = $('#steamUser-id').val();
        let timer = $('#steamUser-timer').val();
        if (! userId || ! timer)
            $('#steamUser-err').text('please fill out the required inputs').fadeIn('slow').delay(2500).fadeOut();
        else
            socket.emit('steamUser-widget', {userId : userId, timer : timer});
    });
    socket.on('steamUser-check', (event) => {
        if (event.err) {
            $('#steamUser-err').text(event.message).fadeIn('slow').delay(2500).fadeOut();
            socket.emit('remove-widget', { key : event.key})
        }
        else {
            $('#steamUserModal').modal('hide')
        }
    });

    /*
      ** github user connect
       */
    $('#add-githubLog').click(function(event){
        event.preventDefault();
        let name = $('#githubLog-name').val();
        let password = $('#githubLog-pass').val();
        if (! name || ! password)
            $('#githubLog-err').text('please fill out the required inputs').fadeIn('slow').delay(2500).fadeOut();
        else
            socket.emit('github-connect', {name : name, password : password});
    });
    socket.on('github-check', (event) => {
        if (event.err) {
            $('#githubLog-err').text(event.message).fadeIn('slow').delay(2500).fadeOut();
        }
        else {
            $('#githubLogModal').modal('hide');
            $('#github-login').fadeOut();
            $('#github-logout').fadeIn();
            $('#repo-toggle').fadeIn();
        }
    });

    let githubWidgetList = [];

    $('#github-logout').click(function (event) {
        githubWidgetList.forEach((key) => {
            rmWidget(key);
            socket.emit('remove-widget', { key : key})
        });
        socket.emit('github-logout', {});
        $('#github-login').fadeIn();
        $('#github-logout').fadeOut();
        $('#repo-toggle').fadeOut();
    });


    $('#add-repo-widget').click(function(event){
        event.preventDefault();
        let name = $('#repo-name').val();
        let timer = $('#repo-timer').val();
        if (! name || ! timer)
            $('#repo-err').text('please fill out the required inputs').fadeIn('slow').delay(2500).fadeOut();
        else
            socket.emit('repo-widget', {name : name, timer : timer});
    });
    socket.on('repo-check', (event) => {
        if (event.err) {
            $('#repo-err').text(event.message).fadeIn('slow').delay(2500).fadeOut();
            socket.emit('remove-widget', { key : event.key})
        }
        else {
            $('#repoModal').modal('hide');
            githubWidgetList.push(event.key);
        }
    });



})(jQuery);

function onSignIn(googleUser) {
    let profile = googleUser.getBasicProfile();
    let id_token = googleUser.getAuthResponse().id_token;
    $('#google-signIn').fadeOut();
    $('#google-signOut').fadeIn();

    socket.emit('google_token', {
        id_token : id_token
    });
}

function signOut() {
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        $('#google-signIn').fadeIn();
        $('#google-signOut').fadeOut();
    });
    auth2.disconnect();
}