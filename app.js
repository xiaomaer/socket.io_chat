/**
 * Created by MMY on 2015/12/14.
 */
//创建express服务器(注意：创建express服务器，需要http模块的支持)
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 3000;
server.listen(port, function () {
    console.log('server listening at port %d', port);
});
//创建路由规则，客户端连接时，发送消息给客户端
app.use(express.static(__dirname + '/public'));//定义静态文件目录

//将socket.io绑定到express服务器
var io = require('socket.io').listen(server);
var namelist = [];//用于存储昵称
//给socket.io添加客户端连接服务器监听事件
io.on('connection', function (socket) {
    console.log('user connected');//输出客户端连接服务器日志
    socket.emit('welcome', {text: 'connected'});//发送消息给新连接服务器的客户端

    //服务器监听客户端提交的昵称，并判断是否已经存在
    socket.on('name', function (data, callback) {
        if (namelist.indexOf(data) === -1) {//昵称不存在
            callback(true);//从服务器返回给客户端的回调函数，昵称不存在返回true
            namelist.push(data);//存储新添加的昵称
            socket.uname = data;//用于断开连接时，从列表时删除
            console.log('昵称：' + namelist);
            io.sockets.emit('usernames', namelist);//把昵称列表广播给所有在线的用户
        }
        else {
            callback(false);//昵称存在，返回客户端为false
        }

    });
    //当有客户端断开连接时，重新发送昵称列表给所有在线客户端，实现实时更新
    socket.on('disconnect', function () {
        if (!socket.uname) return;
        if (namelist.indexOf(socket.uname) > -1) {//从在线列表删除断开连接的客户昵称
            namelist.splice(namelist.indexOf(socket.uname), 1);//数组中删除元素
        }
        console.log('昵称：' + namelist);
        io.sockets.emit('usernames', namelist);//把昵称列表广播给所有在线的用户
    });
    //服务器监听客户端发送的消息，并把消息广播给所有连接服务器的客户端
    socket.on('message', function (data) {
        io.sockets.emit('sendmessage', {senduser: socket.uname, message: data});
    });
});

