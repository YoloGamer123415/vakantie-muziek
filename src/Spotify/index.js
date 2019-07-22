import request from "request";
import getToken from "./getToken";
import { runInThisContext } from "vm";
import { writeFileSync } from "fs";
import { join } from "path";

const clientId = '3d056eea8b38484abe036ecaf9e4f5f9'
const clientSecret = '5bfcaaef432642fa92b0cf9048f919bc'
const userId = '21rmftn2owtsf3bi2iezbv6ui'
const albumId = '7MThLIs5BeIubWDEQ97KOh'
const link = 'https://api.spotify.com/v1'

var Spotify = {
    songs: {
        search: (query, callback) => {
            getToken((err, token) => {
                if (err)
                    throw err
                else {
                    request({
                        uri: `${link}/search?q=${encodeURIComponent(query)}&type=track`,
                        method: 'GET',
                        headers: {
                            authorization: `Bearer ${token}`
                        }
                    }, (error, res, body) => {
                        callback(JSON.parse(body))
                    })
                }
            })
        },
        fetch: (songId, callback) => {
            getToken((err, token) => {
                if (err)
                    throw err
                else {
                    request({
                        uri: `${link}/tracks/${songId}`,
                        method: 'GET',
                        headers: {
                            authorization: `Bearer ${token}`
                        }
                    }, (error, res, body) => {
                        callback(JSON.parse(body))
                    })
                }
            })
        }
    },
    album: {
        fetch: callback => {
            getToken((err, token) => {
                if (err)
                    throw err
                else {
                    var result = {
                        songs: [],
                        length: 0
                    }

                    request({
                        uri: `${link}/users/${userId}/playlists/${albumId}/tracks`,
                        method: 'GET',
                        headers: {
                            authorization: `Bearer ${token}`
                        }
                    }, (error, res, body) => {
                        var data = JSON.parse(body)

                        result.songs = data.items

                        if (data.limit && data.limit < data.total) {
                            for (var i = data.limit; i < data.total; i += data.limit) {
                                request({
                                    uri: `${link}/users/${userId}/playlists/${albumId}/tracks?offset=${i}&limit=${data.limit}`,
                                    method: 'GET',
                                    headers: {
                                        authorization: `Bearer ${token}`
                                    }
                                }, (_error, _res, _body) => {
                                    var _data = JSON.parse(_body)

                                    var temp = result.songs
                                    result.songs = [ ...temp, ..._data.items ]

                                    if (result.songs.length >= data.total) {
                                        result.length = result.songs.length
                            
                                        callback(result)
                                    }
                                })
                            }
                        } else {
                            result.length = result.songs.length

                            callback(result)
                        }
                    })
                }
            })
        },

        add: songId => {

        }
    }
}

export default Spotify
