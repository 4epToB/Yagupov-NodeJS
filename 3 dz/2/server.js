let http = require('http');
var cp = require('child_process');
var child=cp.fork(__dirname+'/child.js')
http.createServer((request,response)=>{
    child.send({ 
        method: request.method, //свойство хранит http метод присланного запроса
        params: request.url //свойство хранит url присланного запроса
    });
    response.statusCode = 200;
    response.end();
}).listen(8080,()=>{console.log("HTTP server works in 8080 port!\n")})