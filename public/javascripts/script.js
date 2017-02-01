$(document).ready(function(){


var socket = io('/join');




socket.on('login', function(){
      socket.emit('username', 'johndoe'); // hard-wired
         // here for simplicity
 });

 socket.on('end', function(data){
   window.location.reload(true);
 });


var mouseovertimer;
var audiostatus = 'off';

$(document).on('mouseenter', '.speaker', function() {
  if (!mouseovertimer) {
    mouseovertimer = window.setTimeout(function() {
      mouseovertimer = null;
      if (!$('.speaker').hasClass("speakerplay")) {
        $('#player')[0].load();
        $('#player')[0].play();
        $('.speaker').addClass('speakerplay');
        return false;
      }
    }, 1000);
  }
});

$(document).on('mouseleave', '.speaker', function() {
  if (mouseovertimer) {
    window.clearTimeout(mouseovertimer);
    mouseovertimer = null;
  }
});

$(document).on('click touchend', '.speaker', function() {
  if (!$('.speaker').hasClass("speakerplay")) {
    if (audiostatus == 'off') {
      $('.speaker').addClass('speakerplay');
      $('#player')[0].load();
      $('#player')[0].play();
      window.clearTimeout(mouseovertimer);
      audiostatus = 'on';
      return false;
    } else if (audiostatus == 'on') {
      $('.speaker').addClass('speakerplay');
      $('#player')[0].play()
    }
  } else if ($('.speaker').hasClass("speakerplay")) {
    $('#player')[0].pause();
    $('.speaker').removeClass('speakerplay');
    window.clearTimeout(mouseovertimer);
    audiostatus = 'on';
  }
});

$('#player').on('ended', function() {
  $('.speaker').removeClass('speakerplay');
  audiostatus = 'off';
});


function toggleFullscreen(elem) {
  elem = elem || document.documentElement;
  if (!document.fullscreenElement && !document.mozFullScreenElement &&
    !document.webkitFullscreenElement && !document.msFullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

$(document).on('click','#btnFullscreen',function() {
  toggleFullscreen();
});




});
