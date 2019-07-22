import * as path from "path";
import express from "express";
import RequestHandler from "./src/requestHandler";
import Spotify from "./src/Spotify";
import request from "request";

const clientId = '3d056eea8b38484abe036ecaf9e4f5f9'
const clientSecret = '5bfcaaef432642fa92b0cf9048f919bc'

const port = process.env.PORT || 80
const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))

app.locals.parseTime = time => {
    var time = Math.ceil(time / 1000)
    var hours = ~~(time / 3600)
    var mins = ~~((time % 3600) / 60)
    var secs = time % 60

    var res = ''

    if (hours > 0) {
        res += `${hours}:${mins < 10 ? '0' : ''}`
    }

    res += `${mins}:${secs < 10 ? '0' : ''}`
    res += `${secs}`

    return res
}

app.get('/', (req, res) => {
    var response = new RequestHandler(req, res, req.path)

    // TODO: kijk of er een user cookie is, zo niet, redirect naar "register"
    Spotify.album.fetch(songs => {
        var totalSongLength = 0
        songs.songs.forEach(song => totalSongLength += song.track.duration_ms)

        response.send({
            user: {
                accepted: true
            },
            album: {
                songs: songs.songs,
                length: songs.length,
                time: totalSongLength
            }
        })
    })
})

app.get('/search', (req, res) => {
    var response = new RequestHandler(req, res, req.path)

    Spotify.songs.search(decodeURIComponent(req.query.query), results => {
        Spotify.album.fetch(songs => {
            var totalSongLength = 0
            songs.songs.forEach(song => totalSongLength += song.track.duration_ms)

            // TODO: kijk of er een user cookie is, zo niet, redirect naar "register"
            response.send({
                user: {
                    accepted: true
                },
                album: {
                    songs: songs.songs,
                    length: songs.length,
                    time: totalSongLength
                },
                search: {
                    query: decodeURIComponent(req.query.query),
                    results: results.tracks.items,
                    length: results.tracks.items.length,
                    total: results.tracks.total
                }
            })
        })
    })
})

app.get('/login', (req, res) => {
    var scopes = 'playlist-modify-public playlist-read-collaborative playlist-read-private playlist-modify-private'
    var redirect_uri = 'http://localhost/login/process'
    res.redirect(
        `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirect_uri)}`
    )
})

app.get('/login/process', (req, res) => {
    var redirectUri = 'http://localhost/login/process'
    request({
        uri: `https://accounts.spotify.com/api/token`,
        method: 'POST',
        headers: {
            authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=authorization_code&code=${req.query.code}&redirect_uri=${encodeURIComponent(redirectUri)}`
    }, (err, response, body) => {
        console.log('body')
        console.log(body)
        console.log('----------------')
        res.status(200).send(body)
    })
})

app.get('/api/song/:songId', (req, res) => {
    Spotify.songs.fetch(req.params.songId, song => {
        res.json(song)
    })
})

app.get('*', (req, res) => {
    var response = new RequestHandler(req, res, req.path)

    response.send()
})

app.listen(port, () => console.log(`listening on port *:${port}`))
