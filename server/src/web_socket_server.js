'use strict';

import {server} from "./http_server.js";

const WebSocketServer = require('websocket').server;

export const wsServer = new WebSocketServer({
  httpServer: server
});

const _connectedUsers = new Map();

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

      _connectedUsers.set(uuid, {
        connection,
        user_name,
        data,
      });

      sendToAll();
    }
  });

  connection.on('close', reasonCode => {
    // close user connection
    console.log('websocket closed');
    const [uuid] = [..._connectedUsers.entries()]
      .find(([uuid, value]) => value.connection === connection) || [];
    _connectedUsers.delete(uuid);
    sendToAll();
  });
});

function sendToAll() {
  const usersInfo = [..._connectedUsers.values()].map(({user_name, data}) => ({user_name, data}));
  _connectedUsers.forEach(({connection, user_name, data}, uuid) => {
    connection.sendUTF(JSON.stringify({ type:'users', data: usersInfo }));
  })
}

