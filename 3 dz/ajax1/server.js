let http = require('http');
let fs = require('fs')
let sendFrom=0
let sendTo=4
const server= http.createServer((req,resp)=>{
    let mainpage
    let notFound='404.html'

    if(req.url=='/'){
        mainpage='index.html'
        fs.readFile(mainpage,'utf-8',(err,data)=>{
            if (err){
                resp.writeHead(404, {'Content-Type':'text/html'});
                resp.write(notFound)
                return resp.end()
            }else{
                console.log(`The file ${mainpage} is read and sent to the client\n`);
                resp.writeHead(200, {'Content-Type':'text/html'});
                resp.end(data);
            }
        })
    } else if(req.url=='/ajax'){
        fs.readFile('ajax.html','utf-8',(err,data)=>{
            if (err){
                resp.writeHead(404, {'Content-Type':'text/html'});
                resp.write(notFound)
                return resp.end()
            }else{
                console.log(`The file ${req.url} is read and sent to the client\n`);
                resp.writeHead(200, {'Content-Type':'text/html'});
                resp.end(data);
            }
        })
        
    }else if(req.url=='/users'){
        fs.readFile('users.json','utf-8',(err,data)=>{
            if (err){
                resp.writeHead(404, {'Content-Type':'text/html'});
                resp.write(notFound)
                return resp.end()
            }else{
                console.log(`The file ${req.url} is read and sent to the client\n`);
                resp.writeHead(200, {'Content-Type':'application/json'});
                resp.end(data);
            }
        })
        
    }else if(req.url=='/products'){
        fs.readFile('products.json','utf-8',(err,data)=>{
            if (err){
                resp.writeHead(404, {'Content-Type':'text/html'});
                resp.write(notFound)
                return resp.end()
            }else{
                let productsToSend=[]
                let products=JSON.parse(data)
                console.log(sendFrom)
                console.log(sendTo)
                if(sendFrom>=products.length){
                    console.log("stop")
                    resp.writeHead(404, {'Content-Type':'text/html'});
                    resp.end();
                } else{
                    console.log("send")
                    for(let i=sendFrom;i<sendTo;i++){
                        productsToSend.push(products[i])
                    }
                    console.log(`The file ${req.url} is read and sent to the client\n`);
                    resp.writeHead(200, {'Content-Type':'application/json'});
                    resp.end(JSON.stringify(productsToSend));
                }
                sendFrom=sendTo
                sendTo+=sendTo
                console.log(sendFrom)
                console.log(sendTo)
                console.log(productsToSend.length)

            }
        })
        
    }

}).listen(8080,()=>{console.log("HTTP server works in 8080 port!\n")})