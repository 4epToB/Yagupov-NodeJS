<template>
  <div>
    <div class="reg" v-if="!visible">
      <div class="line">
        <label for="text-name">Никнейм</label>
        <b-form-input v-model="username" id="text-name" placeholder="Enter your name" ></b-form-input>
      </div>
      <div class="line">
        <label for="text-password">Пароль</label>
        <b-form-input type="password" id="text-password" aria-describedby="password-help-block" v-model="password"></b-form-input>
        <b-form-text id="password-help-block">
          <!-- Your password must be 8-20 characters long, contain letters and numbers, and must not
          contain spaces, special characters, or emoji. -->
        </b-form-text>
      </div>
      <div class="buttonwrap">
        <b-button @click="login" variant="success">Вход</b-button>
        <b-button @click="reg" variant="success">Регистрация</b-button>
      </div>

    </div>
    <router-view></router-view>  
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
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
        if (typeof data==='string')
          alert(data)
      })
    },
  }
}
</script>

<style>
/*   body>div{
      height: 100vh; 
  } */
  body{
    margin: 0px;
    background-color:#82ccdd ;
  }
  .reg{
    width: 250px;
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border:2px solid #6a89cc;
    background-color:#38ada9 ;
    border-radius:20px;
    padding:20px;
    margin:150px auto
  }
  .line{
    width: 206px;
    height: 70px;
  }
  .line input{
    width: 206px;
    height: 30px;
  }
  .line button{
    width: 93px;
    height: 30px;
    border-radius: 3px;
    border: none;
  }
  .buttonwrap{
    height: 40px;
    display: flex;
    justify-content: space-between;
  }

</style>
