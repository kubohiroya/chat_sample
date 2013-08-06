var http = require('http');
var url = require('url');
var ws = require('websocket.io');
var clientHtml = require('fs').readFileSync('chat.html');
var clientJS = require('fs').readFileSync('chat_client.js');

var plainHttpServer = http.createServer(function(req, res) {
        if(0 < req.url.indexOf("html")){
            res.writeHead(200, { 'Content-Type': 'text/html'});
            res.end(clientHtml);
        }else if(0 < req.url.indexOf("js")){
            res.writeHead(200, { 'Content-Type': 'text/javascript'});
            res.end(clientJS);
        }
    }).listen(8888);

// 8888番ポートでクライアントの接続を待ち受ける

var server = ws.listen(7777, function () {
  console.log('\033[96m Server running  \033[39m');
});
 
// クライアントからの接続イベントを処理
server.on('connection', function(socket) {
  // クライアントからのメッセージ受信イベントを処理
  socket.on('message', function(data) {
    // 実行時間を追加
    var data = JSON.parse(data);
    var d = new Date();
    data.time = d.getFullYear()  + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    data = JSON.stringify(data);
    console.log('\033[96m' + data + '\033[39m');
    
    // 受信したメッセージを全てのクライアントに送信する
    server.clients.forEach(function(client) {
      client.send(data);
    });
  });
});
