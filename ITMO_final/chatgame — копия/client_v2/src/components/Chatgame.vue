<template>
  <div class="maincontainer">
      <game></game>
      <chat></chat>
  </div>
</template>

<script>
import Game from './Game.vue'
import Chat from './Chat.vue'
export default {
  data: function () {
    return {
    }
  },
  components: {
    'game':Game,
    'chat':Chat
  },
}

</script>

<style>
.maincontainer{
    display: flex;
    flex-direction: column;
    height: 100%;
}
</style>