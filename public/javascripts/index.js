(function(){
    document.querySelectorAll('table.songs tr.song-item').forEach(song => {
        song.onclick = e => {
            window.location.href = `/view?song=${song.getAttribute('data-songid')}`
        }
    })
})()
