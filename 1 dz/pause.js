/* Требуется реализовать декоратор с параметрами pause, 
который откладывает выполнение функции на указанное 
количество секунд.
function func() {
	console.log('Функция выполниться с задержкой в 2 секунды!');
}
let paused = pause(func, 2);
paused();
*/
function pause(func,sec){
    return function () {
        setTimeout(() => func.apply(this, arguments), sec*1000)
    }
}
function func() {
    console.log('Функция выполниться с задержкой в 2 секунды!')
}
let paused = pause(func,2);
paused(); 

