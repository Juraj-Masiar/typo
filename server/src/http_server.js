
const http = require('http');


export const server = http.createServer((request, response) => {
  // process HTTP request. Since we're writing just WebSockets
  // server we don't have to implement anything.
  console.log(request.method, request.url);

  switch (request.url) {
    case '/api/level_1':
      replyJSON({
        name: 'Level 1',
        text: 'javascript is fun language',
      });
      break;
    case '/api/level_2':
      replyJSON({
        name: 'Level 2',
        text: 'Janko sa vratil domov zo skoly. Na stole nasiel na pokrcenom papieri matkinou rukou napisany odkaz. Vecer oslavujeme otcove narodeniny. Mali by sme nieco pripravit. Umy riad a pozametaj kuchynu! Povysavaj cely byt! V obyvacke utri aj prach a velky stol prikry novym bielym obrusom!',
      });
      break;
    case '/api/level_3':
      replyJSON({
        name: 'Level 3',
        text: 'Modré plody čučoriedky sú veľké ako hrášok, môžu sa jesť samotné, používajú sa ako náplň do koláčov, ovocných pohárov a pod. , môžu sa zavárať. Plody sú sladké a silne farbia na tmavo modro až fialovo - teda sú kvalitným prírodným farbivom. Sú výborným prostriedkom proti hnačkám a prostriedkom na spevnenie stolice. Po ich požití je stolica dobre tvarovaná, tvrdá a tmavá.',
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

