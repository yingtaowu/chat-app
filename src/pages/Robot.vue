<template>
    <div class="advance-chat">
        <mu-appbar title="智能聊天" />

        <div class="chat-cont">
            <div v-for="obj in getrobotmsg">
                <othermsg v-if="obj.user != getusername" :name="obj.user" src="./static/img/robot.jpg" :msg="obj.message"></othermsg>
                <mymsg v-if="obj.user == getusername" :name="getusername" :src="getusersrc" :msg="obj.message"></mymsg>
            </div>
            <div style="height:200px"></div>

            <div class="con-input">
                <div class="input">
                    <input type="text" placeholder="请输入内容" v-model="msg">
                </div>
                <mu-raised-button label="发送" class="demo-raised-button" primary @click="sendmessage" />
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import Mymsg from '@/components/Mymsg.vue'
    import Othermsg from '@/components/Othermsg.vue'

    export default {
        data() {
            return {
                msg: '',
                contentArea: {}
            }
        },
        mounted() {
            this.contentArea = document.querySelector('.chat-cont');
            this.contentArea.scrollTop = this.contentArea.scrollHeight;
        },
        methods: {
            sendmessage() {
                var info = this.msg;
                if (info) {
                    var name = this.getusername
                    var data = {
                        'info': info,
                        'name': name
                    }
                    this.$store.commit('setrobotmsg', {
                        message: info,
                        user: this.getusername
                    })
                    this.$store.dispatch('getrobatmess', data)
                    this.msg = ''
                    setTimeout(() => this.contentArea.scrollTop = this.contentArea.scrollHeight, 0);
                } else {
                    return;
                }
            }
        },
        computed: {
            ...mapGetters([
                'getusername',
            'getrobotmsg',
            'getusersrc'
            ])
        },
        components: {
            Mymsg,
            Othermsg
        }
    }

</script>

<style lang="scss">
    .advance-chat {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        .chat-cont {
            overflow: auto;
            height: 100%;
            .con-input {
                width: 100%;
                position: fixed;
                height: 35px;
                bottom: 55px;
                display: flex;
                .input {
                    flex: 1;
                    input {
                        width: 100%;
                        height: 34px;
                        box-sizing: border-box;
                        border: 1px solid #ddd;
                        color: #333333;
                        font-size: 14px;
                        padding-left: 5px;
                        .mu-text-field {
                            width: 100%;
                        }
                    }
                    .demo-raised-button {
                        height: 50px;
                        background: #ddd;
                    }
                }
            }
        }
    }
</style>