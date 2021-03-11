<template>
    <div class="gamewrap">
        <div class='boardwrap'>
            <p class="username">{{username}}</p>
            <b-list-group deck class='board'>
                <b-list-group-item href="#" bg-variant="light" header="Light" v-for="(cell,index) in 9"
                :key="index"
                :class="myClass"
                :id="index"
                @click="PlayerTurn"
                ></b-list-group-item>               
            </b-list-group>
        </div>
        <div class="statswrap">
            <b-list-group>
                <b-list-group-item>Матчей:{{games}}</b-list-group-item> 
                <b-list-group-item>Побед:{{win}}</b-list-group-item> 
                <b-list-group-item>Ничьих:{{draws}}</b-list-group-item> 
            </b-list-group>
        </div>
        <div class="middlewrap">
            <!-- <b-button variant="warning">Warning</b-button> -->
            <b-button variant="warning" @click="createLobby" v-if="createVisible">Найти оппонента</b-button>
            <b-button variant="warning" @click="deleteLobby" v-if="!createVisible && !ingame">Отменить поиск</b-button>
            <b-button variant="warning" @click="startOver" v-if="youWin || youLose">Выйти из поединка</b-button>
            <figure v-if="ingame">
                <figcaption> Вы играете за </figcaption>
                <p>
                    <img v-bind:src="url" alt="img.descr">
                </p>
            </figure>
            <p v-if="ingame">{{turnText}}</p>
        </div>
        <div class="rightwrap">
            <p class="listname">Cписок лобби:</p>
            <b-list-group>
                <b-list-group-item v-for="(lobby,index) in lobbies"
                :key="index"
                ><span>{{lobby.username}} VS {{lobby.username2}}</span><b-button variant="success" v-if="!lobby.username2" @click="joinLobby(lobby.username)">Присоединиться</b-button></b-list-group-item>
            </b-list-group>
        </div>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            createVisible:true,
            ingame:false,
            myClass:"td",
            myTurn:"",
            myUnit:"",
            username:"",
            userId:"",
            lobbies:"",
            myLobby:"", 
            youWin:false,
            youLose:false,
            Draw:false,
            games:"",
            win:"",
            draws:""
        }
    },
    sockets: {
        youWin: function () {
            this.youWin=true
            console.log('youWin')
            this.games++
            this.win++
        },
        youLose: function () {
            this.youLose=true
            console.log('youLose')
            this.games++
        },
        Draw: function () {
            this.Draw=true
            console.log('youLose')
            this.games++
            this.draws++
        },
        getLobbies:function(lobbies){
            this.lobbies=lobbies
        },
        loggedIn:function(user){
            this.username=user.username
            this.games=user.games
            this.win=user.win
            this.draws=user.draws
            this.userId=user.id
        },
        PlayerTurn:function(data){
            this.myTurn=!this.myTurn
            document.getElementById(data.path).className=data.unit   
        },
        setOponent:function(data){
            data.unit?this.myUnit="zero":this.myUnit="krest"
            data.turn?this.myTurn=1:this.myTurn=0
            this.myLobby=data.lobbyname
        },
        gameStart:function(){
            this.ingame=true  
        },
    },
    methods: {
        PlayerTurn(e){
            if(this.myTurn==true){// Если ход мой
                console.log("мой ход") 
                if(e.target.className=="td"){// я сюда еще не ходил?
                    e.target.className=this.myUnit
                    let drawTrigger=document.querySelectorAll(".td").length
                    this.$socket.emit('PlayerTurn',{path:e.target.id,unit:this.myUnit,lobbyName:this.myLobby,drawTrigger:drawTrigger})
                    this.myTurn=!this.myTurn
                    console.log(e.target)   
                }
            } else {
                console.log("не мой ход")
            }
        },
        createLobby(){
            this.$socket.emit("createLobby",this.username,data=>{
                this.myLobby=data.lobby
                data.unit?this.myUnit="zero":this.myUnit="krest"
                data.turn?this.myTurn=1:this.myTurn=0
                console.log(this.myUnit,this.myTurn)
                this.createVisible=false
            })
        },
        joinLobby(username){
            if(username==this.username)return
            if(this.ingame)return
            this.createVisible=false
            this.$socket.emit("joinLobby",{username:username,username2:this.username})
        },
        deleteLobby(){
            this.$socket.emit("deleteLobby",this.username)
            this.myLobby=''
            this.createVisible=true
            
        },
        startOver(){
            let collection=document.querySelectorAll(".board div")
            for(let i=0;i<collection.length;i++){
                collection[i].className="td"
            }
            this.createVisible=true
            this.ingame=false
            this.myTurn=""
            this.myUnit=""
            this.myLobby=""
            this.youWin=false
            this.youLose=false  
        }

    },
    computed:{
        url(){
            if(this.myUnit=="zero"){
                return "img/zero.png"
            } else {
                return "img/krest.png"
            }
        },
        turnText(){
            if(this.youLose || this.youWin){
                return this.youLose?"Вы проиграли :(":"Вы выиграли!!"
            }
            if(this.Draw){
                return "Победила дружба!Ничья!"
            }
            if(this.ingame){
                if (this.myTurn==false){
                    return "Ожидаем хода Вашего соперника"
                }else {
                    return "Ваш ход"
                }
            }else{
                return "Ищем оппонента..."
            }
        }
    },
    
}
</script>

<style>
*{
    box-sizing: border-box;
}
.boardwrap{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.board{
    width: 270px;
    height: 270px;
    box-sizing: content-box;
    background-color:whitesmoke;
    border: 1px solid gray;
    display: flex;
    flex-wrap: wrap;
    margin: 9px;
}
.tr{
    display: flex;
}
.td{
    background-color:whitesmoke; 
    width: 90px;
    height: 90px;
    min-width: 90px;
    border: 1px solid gray;
}
.zero{
    background-color:whitesmoke; 
    background-image: url(../assets/zero.png);
    background-size: 90px;
    width: 90px;
    height: 90px;
    min-width: 90px;
    border: 1px solid gray;
}
 .krest{
    background-color:whitesmoke; 
    background-image: url(../assets/krest.png);
    background-size: 90px;
    width: 90px;
    height: 90px;
    min-width: 90px;
    border: 1px solid gray;
}
.gamewrap{
    display: flex;
    height: 340px;
    justify-content: space-between;
    padding: 10px 10px 0px 10px;
}
.rightwrap{
    overflow: auto;
    height: 100%;
    width: 350px;
    margin-left: 10px;
}
.middlewrap{
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;
}
.lobbies{
    overflow: auto;
    margin: 0px;
    flex-grow: 1;
    padding-left: 20px;
}
.list-group-item{
    line-height: 20px;
}
.rightwrap .list-group-item{
    display: flex;
    justify-content: space-between;
    flex-wrap:wrap;
    align-items: center;
}
.statswrap{
    margin-top:50px;
}
.username,.listname{
    line-height: 20px;
    height: 20px;
    text-align: center;
    margin: 10px 0px;
}
.button{
    margin: 10px;
    height: 20px;
    width: 200px;
}
</style>