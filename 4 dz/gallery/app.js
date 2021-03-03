const express = require('express');
const app = express();
const fs = require('fs')
const multer = require('multer');
const path = require('path');

app.listen(8080);
app.use(express.static('public'));


const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "uploads");
    },
    filename: (req, file, cb) =>{
        console.log(file)
        cb(null, req.body.name+"_"+req.body.descr+path.extname(file.originalname));  
    }
});
var upload = multer({ storage: storage })


app.post("/", upload.single("img"),function (req, res, next) {
    let img = req.file;
    console.log(req.file) 
    if(!img)
        res.send("Ошибка при загрузке файла");
    else
        fs.readdir('uploads',(error,files)=>{
            if(error){
                console.log("Папка не прочитана")
                res.redirect('/')
                res.end();
            } else {
                console.log("Папка прочитана")
                for (var i = 0; i < files.length; i++) {
                    var mime_type = path.extname(files[i]).substr(1);
                    console.log("data-",files[i],"mime-",mime_type );

                    fs.readFile('uploads' + files[i], function(err,img){
                        if(err){
                            console.log("проблема с файлом")
                            res.redirect('/')
                            res.end();
                        } else {
                            console.log("img",img);
                            chunk = img;
                            res.writeHead(200, {"Content-type": "image/" + mime_type});
                            res.end(chunk);
                        }
                    });
                }
                
            }
        })
        
});
