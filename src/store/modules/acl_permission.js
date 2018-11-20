import { asyncRouterMap, constantRouterMap,templateRouterMap } from '@/router'

const debug = true;//开启所有权限 & 显示所有模板路由
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param permissions
 * @param route
 */
function hasPermission(permissions, route) {
  if (debug)
    return true;

  if(route.meta){
    if(!route.name)
      return true;
    else
      return permissions.indexOf(route.name) >= 0
  }else
    return false
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param permissions
 */
function filterAsyncRouter(routes, permissions) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(permissions, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, permissions);
      }
      res.push(tmp)
    }
  });

  return res
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      let router_list = constantRouterMap.concat(routers);
      if (debug)
        router_list = router_list.concat(templateRouterMap);//显示所有模板自带路由

      state.routers = router_list
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { ps } = data
        let accessedRouters
        accessedRouters = filterAsyncRouter(asyncRouterMap, ps);
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
