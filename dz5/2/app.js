let express = require('express'); //подключаем модуль express
let mustacheExpress = require('mustache-express');
let app = express();//создаем приложение express
app.set('views', __dirname + '/views'); //указываем расположение папки с шаблонами
app.engine('mustache', mustacheExpress()); //регистрируем шаблонизатор Mustache в Express
app.set('view engine', 'mustache'); //указываем использовать Mustache в качестве шаблонизатора
//Устанавливаем обработчик запроса вида: http://localhost:3000/

let bodyParser = require('body-parser'); /*подключаем модуль для обработки содержимого тела post запроса */
app.listen(80); //Настраиваем express приложение слушать запросы на 80 порту
app.use(bodyParser.urlencoded({ extended: false })); /*регистрируем модуль для обработки содержимого тела post запроса в express */
app.use(express.static('public')); /* настраиваем статический сервер, для отдачи контента из папки public */
//Формируем обработчик post запроса на адрес http://localhost:80/somepath
app.post('/somepath', (req, res, next) => {
    console.log('Параметры POST запроса: ' + JSON.stringify(req.body));
    res.render('index', { login: JSON.stringify(req.body.login)});
   /*  res.send(JSON.stringify(req.body)); */

});
/* app.get('/somepath', (req, res, next)=> {
    res.render('index', { title: 'First experence with mustache!' });
}); */