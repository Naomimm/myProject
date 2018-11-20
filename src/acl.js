import router from './router'
import store from './store'
import {Message} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import {getToken} from '@/utils/auth' // getToken from cookie

NProgress.configure({showSpinner: false})// NProgress Configuration

// permission judge function
function hasPermission(permissions, route) {
  if (!route.name)
    return true;
  return permissions.indexOf(route.name) >= 0
}

const whiteList = ['/login', '/auth-redirect']// no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  let acl = store.state.acl;
  if (acl.account_id){
    if (to.path === '/login') {
      next({path: '/'})
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (acl.permissions.length == 0) {
        store.dispatch('GetPermissions').then((resp) => { // 根据roles权限生成可访问的路由表
          let data = resp.data.data;
          let ps = [];
          data.forEach(v => {
            ps.push(v.code)
          });
          store.dispatch('GenerateRoutes', {ps}).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({...to, replace: true}) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({path: '/'})
          })
        })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (!to.name) {
          next();
        }

        if (hasPermission(to.name, store.state.acl.permissions)) {
          next()
        } else {
          next({path: '/401', replace: true, query: {noGoBack: true}})
        }
        // 可删 ↑
      }
    }
  }else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }

})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
