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
    $('#toasterOverlay').click(function() {
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

function getVideoId(number) {
    console.log(number);
    number = parseInt(number);
    var videoId,
        videoIds = {
            0: {
                'id': 'M1LRVICWPUk',
                'sequence': 0,
                'title': 'Intro',
                'nextTitle': 'Video 1'
            },
            1: {
                'id': 'M1LRVICWPUk',
                'sequence': 1,
                'title': 'Video 1',
                'nextTitle': 'Video 2'
            },
            2: {
                'id': '6nT911jkWEo',
                'sequence': 2,
                'title': 'Video 2',
                'nextTitle': 'Video 3'
            },
            3: {
                'id': 'abQRt6p8T7g',
                'sequence': 3,
                'title': 'Video 3',
                'nextTitle': 'Video 4'
            },
            4: {
                'id': 'HamYmjllE6A',
                'sequence': 4,
                'title': 'Video 4',
                'nextTitle': 'Video 5'
            },
            5: {
                'id': 'VHdsoNewFdU',
                'sequence': 5,
                'title': 'Video 5',
                'nextTitle': 'Video 6'
            }
        }

    switch (number) {
    case 0:
        videoId = videoIds[0];
        break;
    case 1:
        videoId = videoIds[1];
        break;
    case 2:
        videoId = videoIds[2];
        break;
    case 3:
        videoId = videoIds[3];
        break;
    case 4:
        videoId = videoIds[4];
        break;
    case 5:
        videoId = videoIds[5];
        break;
    case 6: 
        videoId = videoIds[5];
        break;
    default:
        videoId = videoIds[0];
        break;
    }
    return videoId;
}

function playClickHandler() {
    var playButtons = document.getElementsByClassName('play_active');

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