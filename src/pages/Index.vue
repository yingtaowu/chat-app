<template>
    <div class="chat_index">
        <mu-appbar title="聊天室"></mu-appbar>
        <mu-list>
            <mu-list-item title="王者开黑聊天室" @click="chatgroup('group1')">
                <mu-avatar src="./static/img/1.jpg" slot="leftAvatar" />
                <mu-icon value="chat_bubble" slot="right" />
            </mu-list-item>
            <mu-list-item title="嘻哈逗比聊天室" @click="chatgroup('group2')">
                <mu-avatar src="./static/img/2.jpg" slot="leftAvatar" />
                <mu-icon value="chat_bubble" slot="right" />
            </mu-list-item>
        </mu-list>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'


    export default {
        computed: {
            ...mapGetters([
                'getsocket',
            'getusername',
            'getusersrc'
            ])
        },
        mounted() {
            var that = this
            this.getsocket.on('enterChat', function (obj) {
                console.log('member---', obj)
                that.$store.commit('setusers', obj)
            })
        },

        methods: {
            chatgroup(groupId) {
                var obj = {
                    name: this.getusername,
                    src: this.getusersrc,
                    roomid: groupId
                }
                this.$store.commit('setuserroom', groupId)
                this.getsocket.emit('enterChat', obj)

                var data = {
                    roomid: groupId
                }
                this.$store.dispatch('getmsghistory', data)
                this.$store.commit('setgroupdetailinfos')
                this.$store.commit('changechattoggle')
            }
        }
    }

</script>

<style lang="scss" scoped>
  .chat_index{
      .mu-icon{
          line-height: 1.3
      }
  }
</style>