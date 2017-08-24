var app = require('./mongodb/api');
var logger = require('morgan');
var socketio = require('socket.io');
app.use(logger('dev'));
var server = require('http').createServer(app);
var io = socketio.listen(server);
server.listen(3001);
var room = [];
var mainroom = {
	name: '公共聊天室',
	count: 0
}
io.on('connection', (socket) => {
	console.log(socket.id);
	socket.on('content', (msg) => {
		io.sockets.emit('msg',msg)
	})
	socket.on('group1', function (data) {
        socket.join('group1');
    });
})
console.log('服务器运行中...');