$(document).ready(function(){

  var messages = [];
  var chattime = [];
  var sendername = [];
  var field = $("#btn-input");
  var sendButton = $("#btn-chat");
  var reschat = $('#res-chat');


var socket = io('/play/auction');

socket.on('check', function(data){
  alert(data);
});

  socket.on('priceUpdate', function(data) {
       $('#bids').html(data + "");

  });

 $('#submit').click(function(){

       socket.emit('bid',  $('#input').val() );

 });



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
          //  content.innerHTML = html;
          reschat.html(html);
        } else {
            console.log("There is a problem:", data);
        }
    });

    sendButton.click(function() {
        var text = field.val();
        socket.emit('send', { message: text });
    });


socket.on('check',function(data){

  alert(data.message);
})

});
