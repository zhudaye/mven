var app = require('./mongodb/api');
var socketio = require('socket.io');
var server = require('http').createServer(app);
var io = socketio.listen(server);
server.listen(3001);
io.on('connection', (socket) => {
	socket.on('content', (msg) => {
		io.sockets.emit('msg',msg)
	})
})
console.log('服务器运行中...');