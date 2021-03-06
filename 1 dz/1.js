
var fs = require('fs');
var request = require("request");
var urlResponseObject = [];
var urlList = [];

console.log('Initializing the file reading request....');
console.log('..................................\n');


var fileData = fs.readFileSync('list_of_urls.txt', 'utf8');
if (fileData.length > 5) {
    console.log('File content...\n' + fileData);
    var urlListTemp = fileData.split("\n");
    for (let ui = 0; ui < urlListTemp.length; ui++) {
        var urlString = urlListTemp[ui];
        urlList[ui] = urlString.replace(/\n|\r/g, "");
    }
    console.info(urlList);
} else {
    console.log('File is empty....');
    return false;
}



function readUrl(url) {
    var options = {
        url: url,
        headers: {
            'User-Agent': 'request'
        }
    };
    return new Promise(function(resolve, reject) {
        request.get(options, function(err, resp, body) {
            if (err) {
                resolve(404);
            } else {
                resolve((body));
            }
        })
    })
}


var urlObject = function(url) {
    this._url = url;
    this.updateSucess = updateSucess;
    this.updatePending = updatePending;
    this.updateFailure = updateFailure;

}


function updateSucess() {
    this._status = 'Success';
    this._statusCode = 200;
}


function updatePending() {
    this._status = 'Pending';
}


function updateFailure() {
    this._status = 'Failed';
    this._error = 'Address not found';
}


function runApp() {
    console.log('.........Initialing for loop........\n');
    for (let i = 0; i < urlList.length; i++) {
        let curentUrl = urlList[i];
        

        let currentUrlObject = new urlObject(curentUrl);
        currentUrlObject.updatePending();


        let initializePromise = readUrl(curentUrl);
        initializePromise.then(function(result) {
                console.log('Processing the url => ' + JSON.stringify(curentUrl));
                if (result === 404) {


                    currentUrlObject.updateFailure();
                    console.log('Current reading url => ' + JSON.stringify(currentUrlObject));
                    console.log('Reading status => Failed');
                    console.log('Completed reading for url => ' + JSON.stringify(curentUrl));
                    urlResponseObject[i] = currentUrlObject;
                    let finalResult = JSON.stringify(urlResponseObject);
                    console.log('Total reading completed urls : ' + finalResult);
                    console.log('..................................\n');
                } else {

                    let sourceCode=result;
                    currentUrlObject.updateSucess();
                    console.log('Current reading url : ' + JSON.stringify(currentUrlObject));
                    console.log('Reading status => Success');
                    console.log('Completed reading for url => ' + JSON.stringify(curentUrl));
                    urlResponseObject[i] = currentUrlObject;
                    let finalResult = JSON.stringify(urlResponseObject);
                    console.log('Total reading completed urls => ' + finalResult);
                    console.log('..................................\n');
                }
            },
            function(err) {
                console.log('Error => ' + error);
            })
    }

}


runApp();


var showProcessedUrls = setInterval(function () { 

            console.log('...............Total processed result...................'); 
            console.log(JSON.stringify(urlResponseObject));
            var originalArray = Object.size(urlList);
            var processedArray = Object.size(urlResponseObject);


            if(originalArray==processedArray)
            {
                clearInterval(showProcessedUrls);
            }
    }, 2000);


Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
http.createServer((request, response)=>{
    console.log(`Запрошенный адрес: ${request.url}`)

    response.writeHead(200, {'Content-Type':'text/html'});
     fs.readFile('body.html', 'utf-8', (err, data1) => {
        if (err) {
            console.log('Could not find or open file for reading\n');
            response.statusCode = 404;
            response.end();
        } else {
            console.log(`The file 'body.html' is read and sent to the client\n`);       
        };
    
        fs.readFile('footer.html', 'utf-8', (err, data2) => {
            if (err) {
                console.log('Could not find or open file for reading\n');
                response.statusCode = 404;
                response.end();
            } else {
                console.log(`The file 'footer.html' is read and sent to the client\n`);
            };
        
            fs.readFile('header.html', 'utf-8', (err, data3) => {
                if (err) {
                    console.log('Could not find or open file for reading\n');
                    response.statusCode = 404;
                    response.end();
                } else {
                    console.log(`The file 'header.html' is read and sent to the client\n`);
                    response.write(data3);
                    response.write(data1);
                    response.write(data2);
                    response.end();    
                    console.log("Request accepted!");
                }
            });    
        });
    }); 
});