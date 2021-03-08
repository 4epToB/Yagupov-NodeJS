<template>
  <div class="mainwrap">
      <div class="chatwrap">
          <div class="textarea">
            <ul>
                <li v-for="(message,index) in messages"
                :key="index"
                >{{message.username}}:{{message.text}}</li>
            </ul>    
          </div>
          <div class="input">
            <input type="text" v-model="textMessage">
            <button @click="sendMessage">Отправить</button>
          </div>
      </div>
      <div class="usersList">
          <p>Список игроков:</p>
          <ul>
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

    }
  },
  sockets:{
    newMessage:function(message){
      this.messages.push(message)
    },
    getUsers:function(users){
      this.users=users
    },
  },
  methods:{
    sendMessage(){
      this.$socket.emit("sendMessage",{username:this.username,textMessage:this.textMessage})
    },
  }

}
</script>

<style>
    .mainwrap{
        display: flex;
        max-height: calc(100vh - 335px);
        
    }
    .chatwrap{
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 75%;
    }
    .textarea{
        overflow: auto; 
        width:100%; 
        height:80%;

    }
    .input{
        width:100%; 
        height:20%;
    }
    .usersList{
        overflow: auto;
        height: 100%;
        width: 25%;
    }
</style>