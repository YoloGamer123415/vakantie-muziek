const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const nodemailer = require('nodemailer');

const port = 8080;

var allSongs = ['Rockabye - Clean Bandit ft. Sean Paul & Anne-Marie Nicholson', 'Baby - Michael Jackson'];
var personsToMail = ['joram03@icloud.com'];

app.use(express.static('./public'));

http.listen(port, () => {
    console.log(`listening on port: ${port}`);
});

io.on("connection", (socket) => {
    socket.on('disconnect', () => {});

    socket.on('request songs', () => {
        socket.emit('request total songs', {
            allSongs: allSongs,
            totalSongs: allSongs.length
        });
    });

    socket.on('new songs', (data) => {
        newSongs(data.user, data.newSongs, socket);
    });

    socket.on('new mailadres', (data) => {
        personsToMail.push(data.mailAddress);
        console.log(JSON.stringify(personsToMail));
        
        socket.broadcast.emit('new mailadres', {
            newMailadres: personsToMail
        });

        socket.emit('new mailadres', {
            newMailadres: personsToMail
        });
    });

    socket.on('request users', () => {
        socket.emit('all users', {
            users: personsToMail
        });
    });

    socket.on('verwijder mail', (data) => {
        for (var i = 0; i < personsToMail.length; i++) {
            if (personsToMail[i] === data.mail) {
                personsToMail.splice(i, 1);
                return;
            }
        }

        socket.broadcast.emit('new mailadres', {
            newMailadres: personsToMail
        });

        socket.emit('new mailadres', {
            newMailadres: personsToMail
        });
    });
});

function newSongs(user, newSongs, socket) {
    for (var i = 0; i < newSongs.length; i++) {
        allSongs.push(newSongs[i]);
    }

    socket.broadcast.emit('new songs', {
        newSongs: allSongs,
        newTotal: allSongs.length
    });

    socket.emit('new songs', {
        newSongs: allSongs,
        newTotal: allSongs.length
    });

    sendMail(user, newSongs);
}

function sendMail(user, newSongs) {
    var i = 0;
    
    var timer = setInterval(() => {
        if (i < personsToMail.length) {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'automatic.bot.001@gmail.com',
                    pass: ''
                }
            });
        
            var mailOptions = {
                from: 'automatic.bot.001@gmail.com',
                to: personsToMail[i],
                subject: `${user} heeft nieuwe liedjes toegevoegd!`,
                html: `<style>body {border-radius: 4px;padding: 4px 8px 0;border: 2px solid #639fff;margin: 10px;}ul {list-style-type: square;}.spotify {color: #1db954;}a {text-decoration: none;color: #639fff;}a:hover {color: rgba(99, 159, 255, 0.75);}.unsub {text-align: center;}</style><body><p><strong>${user}</strong> heeft nieuwe liedjes toegevoegd aan de lijst:<ul><li>${newSongs.join('</li><li>')}</li></ul>Als je zelf ook liedjes aan de <span class="spotify">Spotify&copy;</span> afspeellijst wilt toevoegen, ga dan naar <strong><a href="https://vakantie-muziek.glitch.me" target="_blank">deze website</a></strong> en voeg ze toe (het is mogelijk dat het even duurt voordat de site is ingeladen)!<br /><br /><h5 class="unsub">Als je je wilt uitschrijven voor deze mail, kan je dat <strong><a href="https://vakantie-muziek.glitch.me/?session=unsubscribe&mail=${personsToMail[i]}" target="_blank">hier</a></strong> doen (het is mogelijk dat het even duurt voordat de site is ingeladen).</h5></p></body>`
            };

            console.log(personsToMail[i]);

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Email send: ${info.response}`);
                }
            });

            i++;
        } else {
            clearInterval(timer);
            console.log(`Send all mails.`);
        }
    }, 50)
}
