import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
// import permission from './modules/permission'
import permission from './modules/acl_permission'// 权限控制模块 以permission修改
import tagsView from './modules/tagsView'
// import user from './modules/user'
import acl from './modules/acl'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    errorLog,
    permission,
    tagsView,
    // user,
    acl
  },
  getters
})

export default store
