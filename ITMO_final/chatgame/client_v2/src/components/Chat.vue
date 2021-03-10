<template>
  <div class="mainwrap">
      <div class="chatwrap">
          <div class="textarea">
            <ul class="chat">
                <li v-for="(message,index) in messages"
                :key="index"
                >{{message.time}}|{{message.username}}: {{message.text}}</li>
            </ul>    
          </div>
          <div class="input">
            <input type="text" v-model="textMessage">
            <button @click="sendMessage">Отправить</button>
          </div>
      </div>
      <div class="usersList">
          <p class="listname">Список игроков:</p>
          <ul class="list">
            <li v-for="(user,index) in users"
            :key="index"
            >{{user.username}}</li>
          </ul>
      </div>
  </div>
</template>

<script>

export default {
  data: function () {
    return {
        username:"",
        visible:false,
        userId:"",
        messages:[],
        users:[],
        textMessage:"",
        value:"",
        ingame:""

    }
  },
  sockets:{
    loggedIn:function(user){
        this.username=user.username
        this.userId=user.id
    },
    newMessage:function(message){
      this.messages.push(message)
      console.log(this.messages)
    },
    getUsers:function(users){
      this.users=users
    },
    gameStart:function(){
      this.ingame=true
      this.textMessage="/"  
    },
    youWin: function () {
      this.ingame=false
      this.textMessage=""
    },
    youLose: function () {
      this.ingame=false
      this.textMessage=""
    },
  },
  methods:{
    sendMessage(){
      this.$socket.emit("sendMessage",{username:this.username,textMessage:this.textMessage})
      this.textMessage=""
      
    },
  },
  computed:{
    
  }

}
</script>

<style>
    .mainwrap{
      padding: 10px;
      display: flex;
      height: calc(100vh - 340px);
      justify-content: space-between;
        
    }
    .chatwrap{
      display: flex;
      flex-direction: column;
      height: 100%;
      flex-grow: 1;
    }
    .textarea{
      overflow: auto; 
       
      flex-grow: 1;
      padding-bottom:10px ;

    }
    .input{
      display: flex;
       
      height:25px;
      justify-content: space-between;
    }
    .input input{
      flex-grow: 0.99;
    }
    .usersList{
      height: 100%;
      width: 350px;
      display: flex;
      flex-direction: column;
    }
    .list{
      overflow: auto;
      margin: 0px;
      flex-grow: 1;
      padding-left: 20px;
    }
    .chat{
      padding-left:10px;
      list-style: none;
    }
</style>