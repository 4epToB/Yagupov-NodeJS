
let app=Vue.createApp({
    data(){
        return {
            images:[],
              newImgUrl:"",
              newImgDescr:"",
              newimgobj:{},
        }
    },
    computed:{
       
    },
    watch:{
    },
    methods:{

    },
    template:`
        <h2>Галерея</h2>
        <div id="container"></div> 
        <div class="gallery">
            <figure v-for="(img,index) in images">
                <p>
                    <img v-bind:src=url(img.url) alt=img.descr>
                    <img id="deleteicon" src="./img/delete.png" @click="images.splice(index, 1)">
                </p>
                <figcaption>{{img.descr}}</figcaption>
            </figure>
            <div class="add">
                <form name="upload" action="/" method="post" enctype="multipart/form-data">
                    <label>Добавить файл
                        <input name="name" type="text">
                        <input name="descr" type="text">
                        <input name="img" type="file">
                    </label>
                    <button id="btn">Добавить картинку</button>
                </form>
            </div>
        </div>
    `
})
let card=app.mount("#main")




btn.addEventListener('click',()=>{
    let formData = new FormData(document.forms.upload)
    var xhr= new XMLHttpRequest();
    xhr.open('post','/',true);
    xhr.send(formData);
    xhr.onreadystatechange=function() {//(0 → 1 → 2 → 3 → … → 3 → 4)
        if(xhr.readyState!=4)return;
        if(xhr.status!=200) {
            alert(xhr.status+': '+xhr.statusText);// обработать ошибку
        }else {
            console.log("asd"+xhr.responseText); // вывести результат
        }
    }
})