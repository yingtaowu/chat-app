import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import vueRouter from '../router'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        dialog: false,
        dialoginfo: '',
        socket: '',
        chatdetails: {
            id: '',
            users: {},
            infos: []
        },
        userinfo: {
            name: '',
            src: '',
            roomid: ''
        },
        // 存放历史记录
        msghistory: [],
        robotmsg: [{
            message: 'Hi，有什么问题随时问我哦？',
            user: '小公仔'
        }],
        chattoggle: false,
        online: false
    },
    getters: {
        getdialog: state => state.dialog,
        getdialoginfo: state => state.dialoginfo,
        getsocket: state => state.socket,
        getmsghistory: state => state.msghistory,
        getusername: state => state.userinfo.name,
        getusersrc: state => state.userinfo.src,
        getuserroom: state => state.userinfo.roomid,
        getusers: state => state.chatdetails.users,
        getinfos: state => state.chatdetails.infos,
        getrobotmsg: state => state.robotmsg,
        getchattoggle: state => state.chattoggle,
        getonline: state => state.online
    },
    mutations: {
        changedialog(state) {
            state.dialog = !state.dialog
        },
        changedialoginfo(state, data) {
            state.dialoginfo = data
        },
        setgetsocket(state, data) {
            state.socket = data
        },
        setusers(state, data) {
            state.chatdetails.users = data
        },
        setusername(state, data) {
            state.userinfo.name = data
        },
        setusersrc(state, data) {
            state.userinfo.src = data
        },
        setuserroom(state, data) {
            state.userinfo.roomid = data
        },
        setmsghistory(state, data) {
            state.msghistory = data
        },
        setgroupdetailinfos(state) {
            state.chatdetails.infos = []
        },
        addgroupdetailinfos(state, data) {
            state.chatdetails.infos.push(data)
        },
        setrobotmsg(state, data) {
            data == 'clean' ? state.robotmsg = [state.robotmsg[0]] : state.robotmsg.push(data)
        },
        changechattoggle(state) {
            state.chattoggle = !state.chattoggle
        },
        openonline(state) {
            state.online = !state.online
        }
    },
    actions: {
        registersubmit({commit}, data) {
            axios.post('/user/signup', data)
                .then(function (data) {
                    console.log('data--', data);
                    if (data.data.errno === 0) {
                        vueRouter.push('/')
                        commit('changedialog')
                        commit('changedialoginfo', data.data.data)
                    } else {
                        commit('changedialog')
                        commit('changedialoginfo', data.data.data)
                    }
                })
                .catch(function (err) {
                    console.log(err)
                })
        },
        loginsubmit({commit}, data) {
            axios.post('/user/signin', data)
                .then(function (data) {
                    console.log("data--", data);
                    if (data.data.errno === 0) {
                        vueRouter.push('index');
                         commit('setrobotmsg', 'clean')
                        commit('changedialog')
                        commit('changedialoginfo', data.data.data)
                        commit('setusername', data.data.name)
                        commit('setusersrc', data.data.src)
                    } else {
                        commit('changedialog')
                        commit('changedialoginfo', data.data.data)
                    }
                })
                .catch(function (err) {
                    console.log(err)
                })
        },
        getmsghistory({commit}, data) {
            axios.get('/message', { params: data })
                .then(function (data) {
                    console.log("msghistory--", data.data.data);
                    commit('setmsghistory', data.data.data)
                })
                .catch(function (err) {
                    console.log(err)
                })
        },
        getrobatmess({commit}, data) {
            var robotdata = ''
            axios.get('/robotapi', { params: data })
                .then(function (data) {
                    robotdata = JSON.parse(data.data.data)
                    // 分类信息
                    if (robotdata.code === 100000) {
                        commit('setrobotmsg', { message: robotdata.text, user: '小公仔' })
                    } else if (robotdata.code === 200000) {
                        let data = robotdata.text + robotdata.url
                        commit('setrobotmsg', { message: data, user: '小公仔' })
                    } else if (robotdata.code === 302000) {
                        commit('setrobotmsg', { message: '暂不支持此类对话', user: '小公仔' })
                    } else {
                        commit('setrobotmsg', { message: '暂不支持此类对话', user: '小公仔' })
                    }
                })
                .catch(function (err) {
                    console.log(err)
                })
        },
        uploadimg({commit}, data) {
            var config = {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
            axios.post('/file/uploadimg', data, config)
                .then(function (data) {
                    if (data.data.errno === 0) {
                        console.log('上传成功')
                    }
                })
                .catch(function (err) {
                    console.log(err)
                })
        }
    }
});

export default store