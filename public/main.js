/**
 * Created by MMY on 2015/12/14.
 */
var socket = io.connect('http://127.0.0.1:3000');//连接服务器
socket.on('welcome', function (data) {//监听事件，获取服务器发送的消息
    console.log(data.text);//输出消息
});
var doc = document,
    uname = doc.getElementById('uname'),
    addname = doc.getElementById('addname'),
    list = doc.getElementById('namelist'),
    message = doc.getElementById('message'),
    sendmessage = doc.getElementById('addmessage'),
    showmessage = doc.getElementById('show');
//提交表单，将昵称发送到服务器
addname.onsubmit = function () {
    if (uname.value === "") {
        alert("昵称不能为空！");
        return false;
    }
    socket.emit('name', uname.value, function (data) {//在服务器接收消息之后，接收来自服务器端的数据
        if (data) {//昵称不存在列表中，昵称添加成功
            console.log('successfully');//设置昵称成功
            addname.style.display = "none";//隐藏添加昵称表单
            sendmessage.style.display = "block";//显示发送消息表单
        }
        else {//昵称存在于列表
            alert('昵称已存在');
        }
    });
    return false;//阻止提交表单
};
//接收服务器广播的昵称列表，并显示在页面上
socket.on('usernames', function (data) {
    var html = '';
    for (var i = 0; i < data.length; i++) {
        html += '<li>' + data[i] + '</li>';
    }
    list.innerHTML = html;
});
//提交表单，将消息发送给服务器
sendmessage.onsubmit = function () {
    if (message.value === "") {
        alert("消息不能为空！");

    } else {
        socket.emit('message', message.value);
        message.value = "";//清空文本框

    }
    return false;//阻止提交表单
};
//接收服务器发送的客户端发送的消息，并显示在界面
socket.on('sendmessage', function (data) {
    var elem = doc.createElement('p');
    var txt = doc.createTextNode(data.senduser + ':' + data.message);
    elem.appendChild(txt);
    showmessage.appendChild(elem);
});