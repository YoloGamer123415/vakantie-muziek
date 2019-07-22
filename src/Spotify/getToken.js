import request from "request";
import { readFileSync, writeFile } from "fs";
import { join } from "path";

// bearer:  BQCvGHlmaCciRhu8Z28tWuFch5_MjHOk8BmVplJUH_NRWh5g6n3fiTIk90M20cAR9bAhvX9NQ0UUebApCMS7TzOaiDMrgp8K3FmV0Bxe3zQLwEZ0vKfOcGKykzlooQkL0al4JEGxGNFZv4RIMfmzrCFjSJzwtDudJnFvABU1kdRM3rwf6IarqNPsbiK7u36lTwllRNXOzXSB9_nJlgUP-Tok_ZZZ_-GUDdSEYm6ERZMrLAJIP3Q
// refresh: AQB1mOmhpHcoHi0nKRC2pUOoGZpP_PO1gh4nWynRWwiYYF2DnrDj-_sV5QV9httFKvXYBRG3inzISVe8_rgGJCVuDHPnuFRNu-07cENxdrlmjPVZ0zMOmeyDujgj84tOy67AMg
// expired: 1563474204023

const clientId = '3d056eea8b38484abe036ecaf9e4f5f9'
const clientSecret = '5bfcaaef432642fa92b0cf9048f919bc'

var getToken = callback => {
    var [ refreshToken, bearerToken, expiredOn ] = readFileSync(join(__dirname, '../..', 'refreshToken.txt'), 'utf8').split(/\r?\n/)

    if (new Date().getTime() < new Date(expiredOn).getTime()) {
        callback(null, bearerToken)
    } else {
        request({
            uri: `https://accounts.spotify.com/api/token`,
            method: 'POST',
            headers: {
                authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=refresh_token&refresh_token=${refreshToken}`
        }, (err, res, body) => {
            if (err)
                callback(err, null)
            else {
                var data = JSON.parse(body)
                var access_token = data.access_token
                var expires_in = data.expires_in
                
                writeFile(
                    join(__dirname, '../..', 'refreshToken.txt'),
                    `${refreshToken}\n${access_token}\n${parseInt(new Date().getTime() + expires_in)}`,
                    err => {
                        if (err)
                            throw err
                        else {
                            callback(null, access_token)
                        }
                    }
                )
            }
        })
    }
}

export default getToken
