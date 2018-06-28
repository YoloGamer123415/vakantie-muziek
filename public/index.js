const socket = io();
$('.users-html').hide();
$('.unsubscribe-html').hide();

var queries = decodeURIComponent(window.location.search).substring(1).split('&');

if (queries[0].split('=')[1] === 'showUsers') {
    $('.main-html').hide();
    $('.unsubscribe-html').hide();
    $('.users-html').show();
    socket.emit('request users', {});
}

if (queries[0].split('=')[1] === 'unsubscribe') {
    $('.main-html').hide();
    $('.users-html').hide();
    $('.unsubscribe-html').show();
    if (queries[1] === undefined) {
        var error = `noMail`;
        window.location.href = `http://86.93.252.37:8080/?error=${error}`;
    } else {
        $('#unsubMail').html(queries[1].split('=')[1]);
    }
}

if (queries[0].split('=')[1] === 'noMail') {
    M.toast({
        html: `Vul alsjeblieft een mailadres in.`,
        classes: 'red'
    });
} else if (queries[0].split('=')[1] === 'deleted') {
    M.toast({
        html: `Het mailadres is succesvol verwijdert uit de maillijst.`,
        classes: 'green'
    });
}

socket.on('all users', (data) => {
    $('#showUsers').html(data.users.join('<br />'));
});

$(() => {
    $('#muziekNaam').val();
    M.textareaAutoResize($('#muziekNaam'));

    function requestSongs() {
        socket.emit('request songs', {});
    
        socket.on('request total songs', (data) => {
            $('#all-songs').html(`<br />${data.allSongs.join('<br />')}`);
            $('#total-number-songs-header').html(data.totalSongs);
            $('#total-number-songs-footer').html(data.totalSongs);
        });
    }

    function checkSongs(songsToCheck) {
        for (var i = 0; i < songsToCheck.length; i++) {
            if (!songsToCheck[i].includes('-')) {
                return false;
            }
            return true;
        }
    }

    requestSongs();

    socket.on('new songs', (data) => {
        $('#all-songs').html(`<br />${data.newSongs.join('<br />')}`);
        $('#total-number-songs').html(data.newTotal);
    });

    socket.on('new mailadres', (data) => {
        $('#showUsers').html(data.newMailadres.join('<br />'));
    });

    $('#submit-songs').click(() => {
        var username = $('#username').val();
        var songs = $('#muziekNaam').val().split('\n');
    
        if (!username || !checkSongs(songs)) {
            M.toast({
                html: `Vul alsjeblieft alle vakjes (correct) in.`,
                classes: 'red'
            });
        } else {
            socket.emit('new songs', {
                user: username,
                newSongs: songs
            });
        
            M.toast({
                html: `<strong>${songs.length}</strong>&ThickSpace;liedjes zijn succesvol toegevoegd aan de lijst.`,
                classes: 'green'
            });
        }
    });

    $('#submit-mail').click(() => {
        var mailAddress = $('#mail-adres').val();
    
        if (!mailAddress ) {
            M.toast({
                html: `Vul alsjeblieft uw mailadres in.`,
                classes: 'red'
            });
        } else {
            socket.emit('new mailadres', {
                mailAddress: mailAddress
            });
        
            M.toast({
                html: `<strong>${mailAddress}</strong>&ThinSpace;is toegevoegd aan de mail-lijst.`,
                classes: 'green'
            });
        }
    });

    $('#to-homepage').click(() => {
        window.location.href = `http://86.93.252.37:8080/?session=home`;
    });

    $('#delete-mail').click(() => {
        var error = `deleted`;
        socket.emit('verwijder mail', {
            mail: queries[1].split('=')[1]
        });
        window.location.href = `http://86.93.252.37:8080/?error=${error}`;
    });
});
