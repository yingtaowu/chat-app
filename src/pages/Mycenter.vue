<template>
    <div class="my-center">
        <mu-appbar title="个人中心" />

        <div class="center-cont">
            <div class="header">
                <div class="head">
                    <img :src="getusersrc" alt="">
                </div>
                <div class="name">
                    {{getusername}}
                </div>
                <div class="background">
                    <img :src="getusersrc" alt="">
                </div>
            </div>
            <div class="content">
                <mu-list>
                    <mu-list-item title="收藏">
                        <mu-icon slot="left" value="favorite_border" />
                    </mu-list-item>
                    <mu-list-item title="相册">
                        <mu-icon slot="left" value="image_border" />
                    </mu-list-item>
                    <mu-list-item title="设置">
                        <mu-icon slot="left" value="settings_border" />
                    </mu-list-item>
                    <mu-list-item title="关于">
                        <mu-icon slot="left" value="import_contacts" />
                    </mu-list-item>
                </mu-list>
            </div>
            <div class="logout">
                <mu-raised-button @click="logout" label="退出" class="demo-raised-button" fullWidth primary/>
            </div>
            <div style="height:80px"></div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        computed: {
            ...mapGetters([
                'getusersrc',
                'getusername'
            ])
        },
        methods: {
            logout() {
                this.$store.commit('setusername', '')
                this.$store.commit('setusersrc', '')
                this.$router.push('/')
            }
        }
    }

</script>

<style lang="scss">
    .my-center {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        .center-cont {
            overflow: auto;
            .mu-item-left{
                top: 3px;
            }
            .mu-item.show-left{
                padding-left: 60px;
            }
            .header {
                width: 100%;
                /*height: 200px;*/
                .head {
                    width: 80px;
                    margin: 20px auto 0;
                    img {
                        width: 80px;
                        height: 80px;
                        border-radius: 50%;
                    }
                }
                .name {
                    height: 50px;
                    line-height: 50px;
                    color: #0ad5c1;
                    font-size: 18px;
                    text-align: center;
                }
                .background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 200px;
                    z-index: -1;
                    filter: blur(10px);
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
            .logout {
                width: 200px;
                margin: 70px auto 0 auto;
                .mu-raised-button {
                    color: #fff;
                }
            }
        }
    }
</style>