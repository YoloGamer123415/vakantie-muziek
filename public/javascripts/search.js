(function(){
    const close = document.getElementById('close')
    const songPlay = document.getElementById('preview-play')
    const songPause = document.getElementById('preview-pause')

    const viewSong = document.getElementById('view-song')
    const viewSongImage = document.getElementById('view-song-image')
    const viewSongTitle = document.getElementById('view-song-title')
    const viewSongPreviewName = document.getElementById('preview-song-name')
    const viewSongArtists = document.getElementById('view-song-artists')
    const viewSongName = document.querySelector('div.view-song-listenSpotify span.view-song-name')
    const viewSongSpotify = document.querySelector('div.view-song-listenSpotify a.view-song-spotify')

    document.querySelectorAll('table.songs tr.song-item').forEach(song => {
        song.onclick = e => {
            var id = song.getAttribute('data-songid')
            
            fetch(`/api/song/${id}`)
                .then(r => r.json())
                .then(res => {
                    viewSongImage.src = res.album.images[0].url
                    viewSongImage.alt = `'${res.name}' Cover image`
                    viewSongTitle.innerText = res.name
                    viewSongPreviewName.innerText = res.name
                    viewSongArtists.innerText = ''
                    res.artists.forEach((artist, i) => viewSongArtists.innerText += `${artist.name}${i + 1 == res.artists.length ? '' : ', '}`)
                    if (res.explicit) {
                        viewSongArtists.classList.add('explicit')
                    } else {
                        viewSongArtists.classList.remove('explicit')
                    }
                    viewSongName.innerText = res.name
                    viewSongSpotify.href = res.external_urls.spotify

                    var playing = new Howl({
                        src: [ res.preview_url.toString() ],
                        preload: true,
                        volume: 1.0,
                        html5: true,
                        onend: () => {
                            songPause.classList.add('hidden')
                            songPlay.classList.remove('hidden')
                        }
                    })

                    songPlay.onclick = e => {
                        songPlay.classList.add('hidden')
                        songPause.classList.remove('hidden')
                
                        playing.play()
                    }
                
                    songPause.onclick = e => {
                        songPause.classList.add('hidden')
                        songPlay.classList.remove('hidden')
                
                        playing.stop()
                    }

                    close.onclick = e => {
                        viewSong.classList.add('hidden')
                        songPause.classList.add('hidden')
                        songPlay.classList.remove('hidden')
                
                        playing.stop()
                    }

                    viewSong.classList.remove('hidden')
                })
                .catch(console.error)
        }
    })
})()
