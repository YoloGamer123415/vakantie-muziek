(function(){
    const acceptCookies = document.getElementById('accept-cookies')
    const cookieBar = document.getElementById('cookie-bar')
    if (acceptCookies && cookieBar) {
        acceptCookies.onclick = e => {
            cookieBar.classList.add('hidden')
        }
    }

    const scrollTop = document.getElementById('scroll-top')
    scrollTop.onclick = e => {
        document.body.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'start'
        })

        e.preventDefault()
    }

    const header = document.querySelector('header')
    if (header.getAttribute('data-filled') && header.getAttribute('data-filled') == "true")
        header.classList.add('filled')

    window.onscroll = e => {
        if (window.pageYOffset >= (window.innerHeight - 80)) {
            if (header.getAttribute('data-filled') && header.getAttribute('data-filled') == "false")
                header.classList.add('filled')

            scrollTop.classList.remove('hidden')
        } else {
            if (header.getAttribute('data-filled') && header.getAttribute('data-filled') == "false")
                header.classList.remove('filled')

            scrollTop.classList.add('hidden')
        }
    }
})()
