
const http = require('http');


export const server = http.createServer((request, response) => {
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

