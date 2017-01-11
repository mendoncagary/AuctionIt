/*!
 * Start Bootstrap - SB Admin 2 v3.3.7+1 (http://startbootstrap.com/template-overviews/sb-admin-2)
 * Copyright 2013-2016 Start Bootstrap
- * Licensed under MIT (https://github.com/BlackrockDigital/startbootstrap/blob/gh-pages/LICENSE)
 */
$(function() {
    $('#side-menu').metisMenu();
});

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function() {
    $(window).bind("load resize", function() {
        var topOffset = 50;
        var width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    var url = window.location;
    // var element = $('ul.nav a').filter(function() {
    //     return this.href == url;
    // }).addClass('active').parent().parent().addClass('in').parent();
    var element = $('ul.nav a').filter(function() {
        return this.href == url;
    }).addClass('active').parent();

    while (true) {
        if (element.is('li')) {
            element = element.parent().addClass('in').parent();
        } else {
            break;
        }
    }
});


$(document).ready(function(){


  var messages = [];
  var chattime = [];
  var sendername = [];
  var field = document.getElementById("btn-input");
  var sendButton = document.getElementById("btn-chat");
  var reschat = document.getElementById('res-chat');
  var socket = io('/play');


  socket.on('message', function (data) {
          if(data.message) {
  						if(messages.length>=10)
  						{
  							messages.shift();
  						}
              messages.push(data.message);
              chattime.push(data.time);
              sendername.push(data.name);
              var html = '';
              for(var i=0; i<messages.length; i++) {
                  html += "<li class='left clearfix'><span class='chat-img pull-left'><img src='http://placehold.it/50/55C1E7/fff&text=U' alt='User Avatar' class='img-circle' /></span><div class='chat-body clearfix'><div class='header'><strong class='primary-font'>"+sendername[i]+"</strong><small class='pull-right text-muted'><span class='glyphicon glyphicon-time'></span>"+chattime[i]+"</small></div><p>" +messages[i]+"</p></div></li>";
              }

            reschat.innerHTML = html;
          } else {
              console.log("There is a problem:", data);
          }
      });

      sendButton.onclick = function() {
          var text = field.value;
          socket.emit('send', { message: text });
      };



  });
