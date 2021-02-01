const http = require('http'); // подключение модуля http
const fs = require('fs'); // подключение модуля для работы с файлом
const header = "header.html"
const body = "body.html"
const footer = "footer.html"
http.createServer((request, response) => {// вызов метода создания http сервера
    fs.readFile(header,'utf8', (err, datablock) => {
        if (err) {
            console.log('Could not find or open file for reading\n');
            response.statusCode = 404;
            response.end();
        } else {
            console.log(`The file ${header} is read and sent to the client\n`);
        }
        fs.readFile(body,'utf8', (err, bodyblock) => {
            if (err) {
                console.log('Could not find or open file for reading\n');
                response.statusCode = 404;
                response.end();
            } else {
                console.log(`The file ${body} is read and sent to the client\n`);
                response.writeHead(200, {'Content-Type':'text/html'});
            }
            fs.readFile(footer,'utf8', (err, footerblock) => {
                if (err) {
                    console.log('Could not find or open file for reading\n');
                    response.statusCode = 404;
                    response.end();
                } else {
                    console.log(`The file ${footer} is read and sent to the client\n`);
                    response.writeHead(200, {'Content-Type':'text/html'});
                    response.end(datablock+bodyblock+footerblock)
                }
            });
        });
    });
    console.log("Request accepted!");
}).listen(8080, ()=>{
    console.log("HTTP server works in 8080 port!\n");
});
