const http = require('http'); // подключение модуля
const server = http.createServer((request, response) => { // вызов метода создания http сервера
    console.log("HTTP works!");
    response.writeHead(404, {'Content-Type':'text/html'});
    response.write('<meta charset="UTF-8"><h1>Не сработало</h1>');
    response.end();
});
server.listen(8080);