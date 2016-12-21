module.exports = function (io) { // io stuff here...

var currentPrice = 99;
 
io.on('connection', function (socket) {
	
	console.log("a user connected");
	
	socket.emit('login');
	
	socket.on('username', function(username){
      socket.username = username;
 });
 
    socket.emit('message', { message: 'welcome to the chat' });
    
	socket.on('send', function (data) {
        io.sockets.emit('message', data);
	});
	
	socket.emit('priceUpdate',currentPrice);
	
	socket.on('bid', function (data) {
		currentPrice = parseInt(data);
		socket.emit('priceUpdate',currentPrice);
		socket.broadcast.emit('priceUpdate',socket.id + 'bid:'+currentPrice);
	});
	
	socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
});





 }