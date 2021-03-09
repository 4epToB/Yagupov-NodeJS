<template>
    <div class="gamewrap">
        <div class='board'>
            <div v-for="(cell,index) in 9"
            :key="index"
            :class="myClass"
            :id="index"
            @click="turn"
            ></div>
        </div>
        <div class="middlewrap">
            <button @click="createLobby" v-if="createVisible">Найти оппонента</button>
            <button @click="deleteLobby" v-if="!createVisible && !ingame">Отменить поиск</button>
            <button @click="startOver" v-if="youWin || youLose">Выйти из поединка</button>
            <figure v-if="ingame">
                <p>
                    <img v-bind:src="url" alt="img.descr">
                </p>
                <figcaption> Вы играете за </figcaption>
            </figure>
            <p v-if="ingame">{{turnText}}</p>
        </div>
        <div class="rightwrap">
            <ul class="lobbies">
                <li v-for="(lobby,index) in lobbies"
                :key="index"
                >{{lobby.username}}<button @click="joinLobby(lobby.username)">Присоединиться</button></li>
            </ul>            
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
            youLose:false   
        }
    },
    sockets: {
        youWin: function () {
            this.youWin=true
            console.log('youWin')
        },
        youLose: function () {
            this.youLose=true
            console.log('youLose')
        },
        getLobbies:function(lobbies){
            this.lobbies=lobbies
        },
        loggedIn:function(user){
            this.username=user.username
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
        turn(e){
            if(this.myTurn==true){// Если ход мой
                console.log("мой ход") 
                if(e.target.className=="td"){// я сюда еще не ходил?
                    e.target.className=this.myUnit
                    this.$socket.emit('PlayerTurn',{path:e.target.id,unit:this.myUnit,lobbyName:this.myLobby})
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
                this.createVisible=!this.createVisible
            })
        },
        joinLobby(username){
            if(username==this.username)return
            this.createVisible=!this.createVisible
            this.$socket.emit("joinLobby",{username:username,username2:this.username})
        },
        deleteLobby(){
            this.$socket.emit("deleteLobby",this.username)
            this.myLobby=''
            this.createVisible=!this.createVisible
            
        },
        startOver(){
            this.createVisible=true
            this.ingame=false
            this.myTurn=""
            this.myUnit=""
            this.myLobby=""
            this.youWin=false
            this.youLose=false  
            document.querySelectorAll(".board>div").className="td"
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
.board{
    width: 333px;
    height: 333px;
    box-sizing: content-box;
    background-color:whitesmoke;
    border: 1px solid gray;
    display: flex;
    flex-wrap: wrap;
}
.tr{
    display: flex;
}
.td{
    background-color:whitesmoke; 
    width: 111px;
    height: 111px;
    min-width: 111px;
    border: 1px solid gray;
}
.zero{
    background-color:whitesmoke; 
    background-image: url(../assets/zero.png);
    width: 111px;
    height: 111px;
    min-width: 111px;
    border: 1px solid gray;
}
 .krest{
    background-color:whitesmoke; 
    background-image: url(../assets/krest.png);
    width: 111px;
    height: 111px;
    min-width: 111px;
    border: 1px solid gray;
}
.gamewrap{
    display: flex;
    height: 335px;
    justify-content: space-between;
}
.rightwrap{
    overflow: auto;
    height: 100%;
    width: 25%;
}
.lobbies{
    overflow: auto; 
    height: 100%;
}
</style>