
let app=Vue.createApp({
    data(){
        return {
            images:[
                {"descr": "Gorillaz",
                "url": "1.jpg",},
                {"descr": "Eminem",
                "url": "2.jpg",},
                {"descr": "ACDC",
                "url": "3.jpg",},
                {"descr": "Beatles",
                "url": "4.jpg",},
                {"descr": "Крип-а-Крип",
                "url": "5.jpg",},
              ],
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
        url(link){
            if (link.includes("https://")){
                return link
            }else return "../img/"+link
        },
        deleteicon(event){
                console.log(event.path[2])
                console.log(event) 
        },
        addImg(){
            this.newimgobj={
                "descr": this.newImgDescr,
                "url": this.newImgUrl,
            }
            this.images[this.images.length]=this.newimgobj
    },
    },
    template:`
        <h2>Галерея</h2>

        <div class="gallery">
            <figure v-for="(img,index) in images">
                <p>
                    <img v-bind:src=url(img.url) alt=img.descr>
                    <img id="deleteicon" src="../img/delete.png" @click="images.splice(index, 1)">
                </p>
                <figcaption>{{img.descr}}</figcaption>
            </figure>
            <div class="add">
                <label>Введите url:</label>
                <input placeholder=" 2.jpg или https://..." type="text" v-model="newImgUrl">
                <label>Введите описание:</label>
                <input type="text" v-model="newImgDescr">
                <button @click="addImg">Добавить картинку</button>
            </div>
        </div>
    `
})
let card=app.mount("#main")
