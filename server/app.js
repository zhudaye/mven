var un = require('underscore');
var app = require('./mongodb/api');
var logger = require('morgan');
var socketio = require('socket.io');
app.use(logger('dev'));
var server = require('http').createServer(app);
var io = socketio.listen(server);
server.listen(3001);
var room = [];
io.on('connection', (socket) => {
	socket.on('content', (msg) => {
		io.sockets.emit('msg',msg)
	});

	socket.on('login', () => {
		
	});
    //添加房间
    socket.on('addroom', (msg) => {
		if (isin(room, msg.name)) {
			socket.emit('systemmsg', '房间已存在!');
			return;
		}
		room.push(msg);
		socket.emit('systemmsg', '成功添加房间!');
		socket.emit('addroom', msg);
	})

	//加入房间
	socket.on('joinroom', (roomname) => {
        if (!isin(room, roomname)) {
			socket.emit('systemmsg', '房间不存在!');
			return;
		}
		socket.emit('addroom', find(room, roomname));
	})

})
console.log('服务器运行中...');
function isin (arr, ele) {
	return un.some(arr, (room) => {return room.name === ele})
}

function find (arr, ele) {
	return un.find(arr, (room) => {return room.name === ele})
}