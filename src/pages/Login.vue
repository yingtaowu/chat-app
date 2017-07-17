<template>
    <div class="login">
        <mu-appbar title="登录" />
        <div class="content">
            <form action="" name="form2">
                <mu-text-field hintText="请输入账号" fullWidth labelFloat label="账号" v-model.trim="username" />
                <mu-text-field label="密码" hintText="请输入密码" type="password" fullWidth labelFloat v-model.trim="password" />
                <mu-raised-button class="login-btn" label="登录" fullWidth @click="login" primary/>
            </form>

            <div class="register" @click="register">还没账号？注册一个</div>
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
                this.$router.push('register')
            },
            login() {
                let name = this.username;
                let pwd = this.password;
                if (name !== '' && pwd !== '') {
                    var data = {
                        name: name,
                        password: pwd,
                    }
                    this.$store.dispatch('loginsubmit', data)
                } else {
                    this.$store.commit('changedialog')
                    this.$store.commit('changedialoginfo', '帐号密码不能为空')
                }
            }
        }
    }

</script>

<style lang="scss" scoped>
    .login {
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