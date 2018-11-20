import {AccountLogin, getAccountRoles,getPermissions} from '@/api/accounts'
import {getRolePermissions} from '@/api/roles'
import {getToken, setToken, removeToken} from '@/utils/auth'

const acl = {
  state: {
    account_id: '',
    username: '',
    full_name: '',
    permissions: [],
    // name: '',
    avatar: '',
    introduction: '',
    roles: [],
  },

  mutations: {
    SET_ACCOUNT_ID: (state, account_id) => {
      state.account_id = account_id
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_FULL_NAME: (state, full_name) => {
      state.full_name = full_name
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_PERMISSIONS: (state, permissions) => {
      // state.permissions = state.permissions.concat(state.permissions, permissions)
      state.permissions = permissions;
    },
    LOGOUT: (state) => {
      state.account_id = '';
      state.username = '';
      state.token = '';
      state.full_name = '';
      state.roles = '';
      state.permissions = '';
    },
  },

  actions: {
    AccountLogin({commit}, userInfo) {
      const username = userInfo.username.trim()

      return new Promise((resolve, reject) => {
        AccountLogin(username, userInfo.password).then(response => {
          const data = response.data;
          if (data.code == 200) {
            userInfo = data.data;
            commit('SET_ACCOUNT_ID', userInfo.id)
            commit('SET_USERNAME', userInfo.account_name)
            commit('SET_FULL_NAME', userInfo.full_name)
            // commit('SET_PERMISSIONS', userInfo.permissions)
            commit('SET_TOKEN', 123)
            setToken(123);
            // this.$store.dispatch('GetPermissions');
            resolve(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetPermissions({commit, state}) {
      return new Promise((resolve, reject) => {
        if (state.account_id == '')
          reject('请先登录');

        getPermissions(state.account_id).then(response => {
          if (response.data.code !== 200)
            reject('获取用户权限接口异常');

          let data = response.data.data;
          let ps = [];
          data.forEach(v => {
            ps.push(v.code)
          });
          commit('SET_PERMISSIONS', ps);
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({commit, state}) {
      return new Promise((resolve, reject) => {
        commit('LOGOUT');
        removeToken();
        resolve();
      })
    },

  }
}

export default acl
