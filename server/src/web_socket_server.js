'use strict';

const WebSocketServer = require('websocket').server;
const http = require('http');


// --------------------- HTTP server --------------------- //

const server = http.createServer((request, response) => {
  // process HTTP request. Since we're writing just WebSockets
  // server we don't have to implement anything.
  console.log(request.method, request.url);

  switch (request.url) {
    case '/api/level_1':
      replyJSON({
        name: 'level_1',
        words: ['javascript', 'is', 'fun'],
      });
      break;
  }

  function replyJSON(data) {
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(JSON.stringify(data));
    response.end();
  }
});
server.listen(50001, function() { });


// --------------------- WebSocket server --------------------- //

const wsServer = new WebSocketServer({
  httpServer: server
});

const connectedUsers = new Map();

// WebSocket server
wsServer.on('request', request => {
  const connection = request.accept(null, request.origin);
  console.log('websocket opened');

  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', message => {
    if (message.type === 'utf8') {
      // process WebSocket message
      const {utf8Data: clientData} = message;
      const {type, user_name, data, uuid, version} = JSON.parse(clientData);
      console.log('message:', clientData);

      connectedUsers.set(uuid, {
        connection,
        user_name,
        data,
      });

      sendToAll();
    }
  });

  connection.on('close', connection => {
    // close user connection
    console.log('websocket closed');
  });
});

function sendToAll() {
  const usersInfo = [...connectedUsers.values()].map(({user_name, data}) => ({user_name, data}));
  connectedUsers.forEach(({connection, user_name, data}, uuid) => {
    connection.sendUTF(JSON.stringify({ type:'users', data: usersInfo }));
  })
}

