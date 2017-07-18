<template>
  <div id="app">
    <router-view></router-view>

    <!--底部菜单-->
    <div class="bottom" v-show="$route.meta.showTab">
      <mu-paper>
        <mu-bottom-nav :value="$route.name">
          <mu-bottom-nav-item value="index" title="聊天室" icon="chat" to="/index" />
          <mu-bottom-nav-item value="robot" title="机器人" icon="face" to="/robot" />
          <mu-bottom-nav-item value="mycenter" title="我" icon="person" to="/mycenter" />
        </mu-bottom-nav>
      </mu-paper>
    </div>

    <!--聊天组件-->
    <chatting></chatting>

    <!--在线人员-->
    <online></online>

    <!--提示组件-->
    <dialogmodal></dialogmodal>
  </div>
</template>

<script>
  import Dialogmodal from '@/components/Dialog.vue'
  import Chatting from '@/components/Chatting.vue'
  import Online from '@/components/Online.vue'
  import io from 'socket.io-client'

  export default {
    name: 'app',
    components: {
      Dialogmodal,
      Chatting,
      Online
    },
    created: function () {
      this.$store.commit('setgetsocket', io.connect('localhost:8080/')); //连接当前的服务
      this.$router.push('/')
    }
  }

</script>

<style lang="scss">
  @import "../static/style/base.scss";
  #app {
    position: relative;
    width: 100%;
    height: 100%;
    .bottom {
      position: fixed;
      bottom: 0;
      width: 100%;
    }
    .clear {
      clear: both;
    }
  }
</style>