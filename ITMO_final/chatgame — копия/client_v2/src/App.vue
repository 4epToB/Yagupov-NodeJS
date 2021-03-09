<template>
  <div>
    <div v-if="!visible">
      <input type="text" v-model="username">
      <button @click="login">Вход</button>
    </div>
    <router-view></router-view>  
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
        lobbies:"",
        myLobby:"",

    }
  },
  sockets:{
  },
  methods:{
    login(){
      this.$socket.emit("login",this.username,data=>{
        if (typeof data==='string'){
          alert(data)
        }else{
        /* регистрация в монгу + редирект на страницу игры */
          this.visible=!this.visible
          this.$router.push('/chatgame')
        }
      })
    },
  }
}
</script>

<style>
  body>div{
      height: 100vh; 
  }
  body{
    margin: 0px;
  }
</style>
