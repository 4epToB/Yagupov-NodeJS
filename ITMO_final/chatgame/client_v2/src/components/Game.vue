<template>
  <div class='board'>
        <div class="tr">
            <div class="td"></div>
            <div class="td"></div>
            <div class="td"></div>
        </div>
        <div class="tr">
            <div class="td"></div>
            <div class="td"></div>
            <div class="td"></div>
        </div>
        <div class="tr">
            <div class="td"></div>
            <div class="td"></div>
            <div class="td"></div>
        </div>
    </div>
</template>

<script>
    import io from 'socket.io-client';
    let socket = io('http://localhost:3000');

    export default {
        data: function () {
            return {

            }
        },
        methods: {
        },
        created: function () {
            socket.on('setNewPlayer', () => {
                console.log('Connected!');
            });
        }
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
}
.tr{
    display: flex;
}
.td, .td_taken_1, .td_taken_2{
    background-color:whitesmoke; 
    width: 111px;
    height: 111px;
    border: 1px solid gray;
}
</style>