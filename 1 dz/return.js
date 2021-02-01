/* Требуется реализовать декоратор с параметрами returnObject, 
который в случае, если функция возвращает массив, подменяет 
его объектом. Имена задаются в параметрах декоратора. Декоратор 
универсальный, количество имен переменное.
Пример использования №1:
function func(){
	return [1, 2]
}
let func_decoreted = return_object(func, 'one', 'two');
let r = func_decoreted();
console.log(r.one); // 1
console.log(r.two); //2
Пример использования №2:
function func(){
	return ['JS', 'is', 'programming language']
}
let r = return_object (func, 'a', 'b', 'c')();
console.log(r.c) // 'programming language' */


function return_object(func,...names){
	return function(){
		let obj={}
		let arr = func();
		console.log(arr)
		console.log(names[1])	
		for(let i=0;i<names.length;i++){
			obj[names[i]]=arr[i]
		}
		console.log(obj)	
		return obj
	}
}
function func(){
	return ['JS', 'is', 'programming language']
}
let r = return_object (func, 'a', 'b', 'c')();
console.log(r.c)
