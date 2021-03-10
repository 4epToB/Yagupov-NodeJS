<template>
  <div>
    <div v-if="!visible">
      <input type="text" v-model="username">
      <input type="text" v-model="password">
      <button @click="login">Вход</button>
      <button @click="reg">Регистрация</button>
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
        password:"",

    }
  },
  sockets:{
  },
  methods:{
    login(){
      this.$socket.emit("login",{username:this.username,password:this.password},data=>{
        if (typeof data==='string'){
          alert(data)
        }else{
          this.visible=!this.visible
          this.$router.push('/chatgame')
        }
      })
    },
    reg(){
      this.$socket.emit("registration",{username:this.username,password:this.password},data=>{
        if (typeof data==='string'){
          alert(data)
        }else{
        /* регистрация в монгу + редирект на страницу игры */
          /* this.visible=!this.visible */
          /* this.$router.push('/chatgame') */
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
