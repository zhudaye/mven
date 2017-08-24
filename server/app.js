var app = require('./mongodb/api');
var logger = require('morgan');
var socketio = require('socket.io');
app.use(logger('dev'));
var server = require('http').createServer(app);
var io = socketio.listen(server);
server.listen(3001);
var room = [{
		name: '公共聊天室',
		count: 0
	}];
io.on('connection', (socket) => {
	socket.on('content', (msg) => {
		io.sockets.emit('msg',msg)
	});

	socket.on('login', () => {
		room[0].count++;
		io.sockets.emit('updateallroom',room)
	});
    //添加房间
    socket.on('addroom', (msg) => {
		if (room.length >= 7) {
			socket.emit('roomfull','房间数已满!');
			return;
		};

		for (var i = 0; i < room.length; i++) {
			if (room[i].name === msg.name) {
				socket.emit('roomfull','房间已存在!');
				return;
			}
		}
		room.push(msg);
		io.sockets.emit('updateallroom',room)
	})

})
console.log('服务器运行中...');