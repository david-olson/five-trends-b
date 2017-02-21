window.onload = function () {
    main();
}

function millisToMinsAndSecs(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

function main() {
    var vidLength = document.getElementById('vidLength');
    setInterval(function () {
        if (player.getPlayerState() === 1) {
            var currentTime = player.getCurrentTime();
            currentTime = parseInt(currentTime);
            if (currentTime < 10) {
                currentTime = '0:0' + currentTime;
            } else if (currentTime < 60) {
                currentTime = '0:' + currentTime;
            } else {
                var mins = currentTime / 60,
                    seconds = currentTime % 60;
                mins = parseInt(mins);
                if (seconds < 10) {
                    seconds = '0' + seconds;
                }
                currentTime = mins + ':' + seconds;
            }
            vidLength.innerHTML = currentTime;
        }
    }, 500);
    playClickHandler();
    player.addEventListener('onStateChange', 'initialize');
    $('#toasterOverlay').click(function () {
        closeShare();
    });
    //    $('#shareClose').mouseenter(function () {
    //        var randomVals1 = Math.floor(Math.random() * (-100 - 100 + 1) - 1),
    //            randomVals2 = Math.floor(Math.random() * (-100 - 100 + 1) - 1),
    //            spinVal = Math.floor(Math.random() * 360),
    //            translateVal = 'translate(' + randomVals1 + '%, ' + randomVals2 + '%) rotate(' + spinVal + 'deg)';
    //        $('#shareToaster').css({
    //            //        transform: 'translate(-50%, -500%)'
    //            transform: translateVal
    //        });
    //    });
    document.getElementById('facebookShare').addEventListener('click', function (e) {
        e.preventDefault();
        FB.ui({
            method: 'share',
            href: 'https://premierinc.com',
            app_id: '382579548779670',
            display: 'iframe'
        }, function (response) {});
    });
}

function getQuery(variable) {
    var query = window.location.search.substring(1),
        vars = query.split('&'),
        x;

    for (x = 0; x < vars.length; x++) {
        var pair = vars[x].split('=');
        if (pair[0] == variable) {
            return pair[1];
        }
        return (false);
    }
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

function getCookie(cname) {
    var name = cname + '=',
        ca = document.cookie.split(';'),
        x;
    for (x = 0; x < ca.length; x++) {
        var c = ca[x];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function playClickHandler() {
    var playButtons = document.getElementsByClassName('play_enabled');

    for (var x = 0; x < playButtons.length; x++) {
        playButtons[x].addEventListener('click', function (e) {
            e.preventDefault();
            var activeRow = $('.active_row');
            activeRow = activeRow[0].id.substr(-1);
            if (activeRow == this.id.substr(-1)) {
                if (player.getPlayerState() == 2) {
                    player.playVideo()
                } else {
                    player.pauseVideo();
                }

            } else {
                var attr = this.id,
                    videoId = attr.substr(-1),
                    videoSelector;

                videoId = getVideoId(videoId);
                player.loadVideoById({
                    videoId: videoId.id
                });
                $('.active_row').removeClass('active_row');
                videoSelector = 'row' + videoId.sequence;
                $('#' + videoSelector).addClass('active_row');

                history.pushState(null, null, '?id=' + videoId.sequence);
            }

        });
    }
}

function shareClickHandler() {
    var toasterOverlay = document.getElementById('toasterOverlay'),
        shareToaster = document.getElementById('shareToaster'),
        shareButton = document.getElementById('shareButton'),
        videoLink = document.getElementById('shareLink'),
        link = window.location.href;

    videoLink.innerHTML = link;

    setTimeout(function () {
        $('#toasterOverlay').fadeIn(500);
        $('#shareToaster').css({
            display: 'block'
        })
        setTimeout(function () {
            $('#shareToaster').css({
                'transform': 'translate(-50%, -50%)'
            });
        }, 500);
        setTimeout(function () {
            $('#shareToaster').css({
                'transform': 'translate(-50%, -50%)'
            });
        }, 1000);
    }, 500);
}

function closeShare() {
    $('#shareToaster').css({
        transform: 'translate(-50%, -500%)'
    });
    setTimeout(function () {
        $('#toasterOverlay').fadeOut(500);
        $('#shareToaster').css({
            display: 'none'
        });
    }, 500);
}

function playDisabledClickHandler() {
    var playButtonsDisabled = document.getElementsByClassName('play_disabled'),
        x;
    for (x = 0; x < playButtonsDisabled.length; x++) {
        playButtonsDisabled[x].addEventListener('click', function (e) {
            e.preventDefault();
        })
    }
}

function formClickHandler() {
    var formSlideDown = document.getElementById('formHolder');
    
    $(formSlideDown).slideDown(750);
}