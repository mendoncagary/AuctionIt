$(document).ready(function(){

 var messages = [];
 var chattime = [];
 var sendername = [];
var socket = io('/play');




socket.on('login', function(){
      socket.emit('username', 'johndoe'); // hard-wired
         // here for simplicity
 });

 socket.on('end', function(data){
   window.location.reload(true);
 });

socket.on('message', function (data) {

        if(data.message) {
						if(messages.length>=10)
						{
							messages.shift();
              chattime.shift();
              sendername.shift();
						}
            messages.push(data.message);
            chattime.push(data.time);
            sendername.push(data.name);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += "<li class='left clearfix'><span class='chat-img pull-left'><img src='http://placehold.it/50/55C1E7/fff&text=U' alt='User Avatar' class='img-circle' /></span><div class='chat-body clearfix'><div class='header'><strong class='primary-font'>"+sendername[i]+"</strong><small class='pull-right text-muted'><span class='glyphicon glyphicon-time'></span>"+chattime[i]+"</small></div><p>" +messages[i]+"</p></div></li>";
            }
          $('#res-chat').html(html);
        }
    });

    $(document).on('click','#btn-chat',function() {
      if($('#btn-input').val())
      {
        var text = $('#btn-input').val();
        socket.emit('send', { message: text });
        $("#btn-input").val('');
      }
    });



//speaker

//var getaudio = $('#player')[0];
/* Get the audio from the player (using the player's ID), the [0] is necessary */
var mouseovertimer;
/* Global variable for a timer. When the mouse is hovered over the speaker it will start playing after hovering for 1 second, if less than 1 second it won't play (incase you accidentally hover over the speaker) */
var audiostatus = 'off';
/* Global variable for the audio's status (off or on). It's a bit crude but it works for determining the status. */

$(document).on('mouseenter', '.speaker', function() {
  /* Bonus feature, if the mouse hovers over the speaker image for more than 1 second the audio will start playing */
  if (!mouseovertimer) {
    mouseovertimer = window.setTimeout(function() {
      mouseovertimer = null;
      if (!$('.speaker').hasClass("speakerplay")) {
        $('#player')[0].load();
        /* Loads the audio */
        $('#player')[0].play();
        /* Play the audio (starting at the beginning of the track) */
        $('.speaker').addClass('speakerplay');
        return false;
      }
    }, 1000);
  }
});

$(document).on('mouseleave', '.speaker', function() {
  /* If the mouse stops hovering on the image (leaves the image) clear the timer, reset back to 0 */
  if (mouseovertimer) {
    window.clearTimeout(mouseovertimer);
    mouseovertimer = null;
  }
});

$(document).on('click touchend', '.speaker', function() {
  /* Touchend is necessary for mobile devices, click alone won't work */
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
  /*When the audio has finished playing, remove the class speakerplay*/
  audiostatus = 'off';
  /*Set the status back to off*/
});


//Fullscreen API

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




    $(document).on('click',".trigger",function() {
    $(".menu").toggleClass("active");
    });



});
