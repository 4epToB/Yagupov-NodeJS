let http = require('http');
let fs = require('fs');
let path = require('path');
http.createServer((request,response)=>{
/*     let mimeTypes={
        '.html': 'text/html',
        '.txt': 'text/plain'
    } */
    if (request.url==='/'){
        pathname='index.html'
        fs.readFile('index.html','utf8',(err,data)=>{
            if(err){
                console.log('Страница не найдена')
                response.statusCode=404
                return response.end()
            }else{
                console.log('Страница отправлена')
                response.writeHead(200,{'Content-Type':'text/html'})
                response.end(data)  
            }
        })
    } else if (request.url==='/data'){
        fs.readFile('data.txt','utf8',(err,data)=>{
            if(err){
                console.log('Файл не найден')
                response.statusCode=404
                return response.end()
            }else{
                let arr = data.split(" ");
                let data1=arr.filter((number)=>{return number%2==0}).join(" ")
                let data2=arr.map((number)=>{return Math.pow(number, 3)}).join(" ")
                fs.writeFile('out-1.txt', data1, () => {console.log("Файл out-1.txt записан")});
                fs.writeFile('out-2.txt', data2, () => {console.log("Файл out-2.txt записан")});
                console.log('Файл найден и отправлен')
                response.writeHead(200,{'Content-Type':'text/plain'})
                response.end(data)
                console.log(data1)
                console.log(data2)
                
            }
        })
    }
}).listen(8080,()=>{console.log("HTTP server works in 8080 port!\n")})