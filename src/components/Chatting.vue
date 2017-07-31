<template>
    <transition name="slide-left">
        <div class="chatting" v-show="getchattoggle">
            <mu-appbar>
                <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="closeChat" /> 聊天({{Object.keys(getusers).length}})
                <mu-icon-button icon="group" slot="right" @click="openOnline" />
            </mu-appbar>

            <!-- 聊天内容区域 -->
            <div class="chatting-content" @click="showEmoji(isShowEmoji=false);">
                <div v-for="obj in getmsghistory">
                    <othermsg v-if="obj.username != getusername" :name="obj.username" :src="obj.src" :msg="obj.msg" :img="obj.img"></othermsg>
                    <mymsg v-if="obj.username == getusername" :name="obj.username" :src="obj.src" :msg="obj.msg" :img="obj.img"></mymsg>
                </div>
                <div v-for="obj in getinfos">
                    <othermsg v-if="obj.username != getusername" :name="obj.username" :src="obj.src" :msg="obj.msg" :img="obj.img"></othermsg>
                    <mymsg v-if="obj.username == getusername" :name="obj.username" :src="obj.src" :msg="obj.msg" :img="obj.img"></mymsg>
                </div>
            </div>

            <div class="chatting-input">
                <div class="send-input">
                    <textarea v-model.trim="inputText" ref="textarea" placeholder="请输入聊天内容"></textarea>
                    <mu-raised-button label="发送" fullWidth primary @click="send" />
                </div>
                <div class="functions-area">
                    <mu-icon @click="showEmoji(isShowEmoji=!isShowEmoji);" value="insert_emoticon" />
                    <mu-icon @click="imgUpload" value="crop_original" />
                </div>
                <input id="selectedImg" name='selectedImg' type='file' multiple='mutiple' accept="image/*;capture=camera" style="display: none"
                    @change="sendImg">

                    <transition name="fade">
                        <div v-show="isShowEmoji" class="emoji-display">
                            <ul>
                                <li @click="addEmoji(item)" v-for="item of emojis">{{item}}</li>
                            </ul>
                        </div>
                    </transition>
            </div>

        </div>
    </transition>
</template>

<script>
    import { mapGetters } from 'vuex'
    import Mymsg from '@/components/Mymsg.vue'
    import Othermsg from '@/components/Othermsg.vue'

    export default {
        name: 'chatting',
        data() {
            return {
                inputText: '',
                isShowEmoji: false,
                inputArea: {},
                emojis: ['😂', '🙏', '😄', '😏', '😇', '😅', '😌', '😘', '😍', '😜', '😎', '😊', '😳', '😱', '😒', '😔', '😷', '👿', '😩', '😤', '😣', '😰', '😭', '👻', '👍', '✌️', '👉', '👀', '🐶', '🐷', '😹', '⚡️', '🔥', '🌈', '🍏', '⚽️', '❤️']
            }
        },

        //el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。
        mounted() {
            const that = this
            this.getsocket.on('message', function (obj) {
                that.$store.commit('addgroupdetailinfos', obj)
                window.scrollTo(0, 900000)
            })

            this.getsocket.on('logout', function (obj) {
                that.$store.commit('setusers', obj)
            })

            this.inputArea = document.querySelector('.chatting-content');
            this.inputArea.scrollTop = this.inputArea.scrollHeight;
        },

        methods: {
            showEmoji(flag) {
                this.isShowEmoji = flag;
            },
            addEmoji(str) {
                const inputArea = this.$refs.textarea;
                //selectionStart输入性元素selection起点的位置，selectionEnd输入性元素selection结束点的位置
                let startPos = inputArea.selectionStart;
                let endPos = inputArea.selectionEnd;
                let tempVal = inputArea.value;
                this.inputText = tempVal.substring(0, startPos) + str + tempVal.substring(startPos, tempVal.length)
            },
            send() {
                if (this.inputText === '') {
                    return;
                } else {
                    var obj = {
                        username: this.getusername,
                        msg: this.inputText,
                        src: this.getusersrc,
                        img: '',
                        room: this.getuserroom
                    };
                    this.getsocket.emit('message', obj);

                    this.inputText = '';
                    setTimeout(() => this.inputArea.scrollTop = this.inputArea.scrollHeight, 0);
                }
            },
            closeChat() {
                var obj = {
                    name: this.getusername,
                    roomid: this.getuserroom
                }
                this.isShowEmoji = false;
                this.getsocket.emit('logout', obj)
                this.$store.commit('changechattoggle')
            },
            openOnline() {
                this.$store.commit('openonline')
                this.isShowEmoji = false;

            },
            imgUpload() {
                var file = document.getElementById('selectedImg')
                file.click()
            },
            sendImg() {
                var that = this
                var imgData = document.getElementById('selectedImg').files[0]
                if (imgData) {
                    var formdata = new window.FormData()
                    formdata.append('file', imgData)
                    formdata.append('username', that.getusername)
                    formdata.append('src', that.getusersrc)
                    formdata.append('roomid', that.getuserroom)
                    console.log("formdata--",formdata);
                    this.$store.dispatch('uploadimg', formdata)
                    var fr = new window.FileReader() //HTML5定义了FileReader作为文件API的重要成员用于读取文件，根据W3C的定义，FileReader接口提供了读取文件的方法和包含读取结果的事件模型。
                    fr.onload = function () {
                        var obj = {
                            username: that.getusername,
                            src: that.getusersrc,
                            img: fr.result,
                            msg: '',
                            room: that.getuserroom
                        }
                        that.getsocket.emit('message', obj)
                    }
                    fr.readAsDataURL(imgData)
                    //调用FileReader对象的方法(readAsDataURL将文件读取为DataURL),该方法将文件读取为一段以 data: 开头的字符串，
                    //这段字符串的实质就是 Data URL，Data URL是一种将小文件直接嵌入文档的方案。这里的小文件通常是指图像与 html 等格式的文件。
                }
            }
        },

        computed: {
            ...mapGetters([
            'getsocket',
            'getmsghistory',
            'getinfos',
            'getusers',
            'getusername',
            'getusersrc',
            'getuserroom',
            'getchattoggle'
            ])
        },

        components: {
            Mymsg,
            Othermsg
        }
    }

</script>

<style lang="scss">
    .chatting {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        background: #f0f0f0;
        .chatting-content {
            flex: 1;
            width: 100%;
            overflow: auto;
        }
        .chatting-input {
            position: relative;
            width: 100%;
            border-top: 1px solid #eee;
            .send-input {
                width: 100%;
                height: 40px;
                display: flex;
            }
            .functions-area {
                background: #eee;
                padding: 7px;
                height: 40px;
                .mu-icon {
                    font-size: 28px;
                }
            }
            .emoji-display {
                width: 100%;
                background-color: white;
                border-top: 1px solid #eee;
                padding: 0 6px;
                ul {
                    display: flex;
                    flex-wrap: wrap;
                    li {
                        padding: 4px;
                        font-size: 1.5rem;
                    }
                }
            }
            textarea {
                flex: 1;
                resize: none;
                padding-left: 3px;
                padding-top: 9px;
                padding-right: 3px;
                height: 100%;
            }
            button {
                width: 60px;
                height: 100%;
                color: white;
                font-size: 16px;
            }
        }
    }
</style>