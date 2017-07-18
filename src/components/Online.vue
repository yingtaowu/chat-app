<template>
    <transition name="slide-left">
        <div class="all-chat" v-show="getonline">
            <mu-appbar>
                <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="closeOnline" /> 在线成员({{Object.keys(getusers).length}})
            </mu-appbar>
            <div v-for="obj in getusers" class="online-person">
                <img :src="obj.src" alt="">
                <div>{{obj.name}}</div>
            </div>
        </div>
    </transition>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: 'online',
        computed: {
             ...mapGetters([
              'getusers',
            'getonline'
            ])
        },
        methods: {
            closeOnline() {
                this.$store.commit('openonline')
            }
        }
    }

</script>

<style lang="scss">
    .all-chat {
        position: absolute;
        top: 0;
        background: #fff;
        width: 100%;
        height: 100%;
        z-index: 10;
        .online-person {
            display: inline-block;
            margin: 15px 10px;
            text-align: center;
            img {
                width: 55px;
                height: 55px;
            }
        }
    }
</style>