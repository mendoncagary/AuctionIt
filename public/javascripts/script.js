$(document).ready(function(){
	
 var messages = [];
 var field = document.getElementById("field");
 var sendButton = document.getElementById("send");
 var content = document.getElementById("content");

	
var socket = io();



socket.on('login', function(){
      socket.emit('username', 'johndoe'); // hard-wired
         // here for simplicity
		 
 });
 
 
	 
 socket.on('priceUpdate', function(data) {
      $('#bids').html(data + "");
	  
 });

$('#submit').click(function(){
     socket.emit('bid',  $('#input').val() );
});	


socket.on('message', function (data) {
        if(data.message) {
            messages.push(data.message);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += messages[i] + '<br />';
            }
            content.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }
    });

    sendButton.onclick = function() {
        var text = field.value;
        socket.emit('send', { message: text });
    };


	
});



