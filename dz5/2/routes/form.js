let express = require('express'); //подключаем модуль express
let router = express.Router(); //создаем новый роутер
router.get(':login', (req, res, next)=>{ //вешаем на роут обработчик get запросов
    //Выводим параметры из маршрута
    console.log(`Параметры url: login ${req.params.login}` +
    ` mail ${req.params.mail}`) +
    ` pass ${req.params.pass}`;
    res.send(`Пользователь ${req.params.login} зарегистрирован`); //Отправляем клиенту, строчку 'Ok!'
});
module.exports = router; 