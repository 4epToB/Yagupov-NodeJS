<template>
  <div class="mainwrap">
      <div class="chatwrap">
          <div class="textarea">
            <b-list-group>
                <b-list-group-item :variant="getvariant(message.username)" v-for="(message,index) in messages"
                :key="index"
                >{{message.time}}|{{message.username}}: {{message.text}}</b-list-group-item>
            </b-list-group>   
          </div>
          <div class="input">
            <b-form-input type="text" v-model="textMessage"></b-form-input>
            <b-button variant="dark" @click="sendMessage">Отправить</b-button>
          </div>
      </div>
      <div class="usersList">
          <p class="listname">Список игроков:</p>
          <b-list-group>
            <b-list-group-item v-for="(user,index) in users"
            :key="index"
            >{{user.username}}</b-list-group-item>
          </b-list-group>
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
    getvariant(username){
      if(username=="admin"){
        return "warning"
      }else if(username==this.username){
        return "info"
      }else{
        return "light"
      }
    }
  },
  computed:{

  },
  updated: function () {
    this.$nextTick(function () {
      var myDiv = document.querySelector(".textarea")
      myDiv.scrollTop = myDiv.scrollHeight 
    })
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
      margin-bottom: 10px;
      flex-grow: 1;
      padding-bottom:10px ;

    }
    .input{
      display: flex;
      /*   */
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
      margin-left: 10px;
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