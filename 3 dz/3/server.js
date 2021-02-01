const http = require('http');
const cp = require('child_process');
const url = require('url');
const child = cp.fork('./child.js');
let childReady = false
function childSaidReady(status){
    if (status === 'ready') {
    childReady = true;
    child.off('message', childSaidReady); 
    console.log('Server ready');
    }
}
child.on('message', childSaidReady);
http.createServer((request, response)=>{
    let _get = url.parse(request.url, true).query;
    console.log('Parametrs of request: ' + JSON.stringify(_get));
    if(!(_get.num1 && _get.num2)){
        console.log('Bad Request');
        response.statusCode = 400;
        response.end();
    return;
    }
    if (!childReady){
        console.log('Service Unavailable');
        response.statusCode = 503;
        response.end();
        return;
    }
    let expression = `${_get.num1}+${_get.num2}=`;
    function responseFromChild(data){
        if (data.expression === expression){//сравнение прошлого ответа от ребенка с результатом с новым запросом который мы парсили выше? что бы не считать два раза?
            response.writeHead(200, {'Content-Type':'text/html'});
            response.write(`<h1>${data.result}</h1>`);
            response.end();
            child.off('message', responseFromChild);
            }
        }
        child.on('message', responseFromChild);
        child.send({expression});
}).listen(8080, ()=>{console.log('Server run in 8080 port!')});
// если удалить строку из mathdata то он ищет похожую предыдущую операцию,находит где хотя бы первое слогаемое такое же и берет результат оттуда?