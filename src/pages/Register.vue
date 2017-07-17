<template>
    <div class="register">
        <mu-appbar title="注册">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="$router.go(-1)" />
        </mu-appbar>
        <div class="content">
            <mu-text-field hintText="请输入账号" fullWidth labelFloat label="账号" v-model.trim="username" />
            <mu-text-field label="密码" hintText="请输入密码" type="password" fullWidth labelFloat v-model.trim="password"/>
            <mu-raised-button class="login-btn" label="注册" fullWidth @click="register" primary/>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                username: '',
                password: ''
            }
        },
        methods: {
            register() {
                let name = this.username;
                let pwd = this.password;
                var src = './static/img/' + Math.ceil(Math.random() * 10) + '.jpg'
                if (name !== '' && pwd !== '') {
                    var data = {
                        name: name,
                        password: pwd,
                        src: src
                    }
                    this.$store.dispatch('registersubmit', data)
                } else {
                    this.$store.commit('changedialog')
                    this.$store.commit('changedialoginfo', '帐号密码不能为空')
                }
            }
        }
    }

</script>

<style lang="scss" scoped>
    .register {
        .content {
            padding: 10px 20px;
        }
        .login-btn {
            margin-top: 20px;
        }
        .register {
            text-align: center;
            margin-top: 10px;
        }
    }
</style>