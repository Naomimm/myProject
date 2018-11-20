import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
// 不受权限控制的路由
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  },

  // module 功能模块
  {
    path: '/acl',
    component: Layout,
    redirect: '/acl/accounts',
    meta: { title: '系统权限管理', icon: 'tree', noCache: true },
    children: [
      {
        path: 'accounts',
        component: () => import('@/views/acl/accounts'),
        name: 'accounts',
        meta: { title: '后台账户管理', noCache: true }
      },
      {
        path: 'roles',
        component: () => import('@/views/acl/roles'),
        name: 'roles',
        meta: { title: '角色列表', noCache: true }
      },
      {
        path: 'permissions',
        component: () => import('@/views/acl/permissions'),
        name: 'permissions',
        meta: { title: '权限列表', noCache: true }
      },
      {
        path: 'set_roles/:accountId',
        component: () => import('@/views/acl/set_roles'),
        props: true,
        hidden: true,
        name: 'set_roles',
        meta: { title: '设置角色', noCache: true }
      },
      {
        path: 'set_permissions/:roleId',
        component: () => import('@/views/acl/set_permissions'),
        props: true,
        hidden: true,
        name: 'set_permissions',
        meta: { title: '设置权限', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

// 权限控制的路由
export const asyncRouterMap = [
  {
    path: '/assets',
    component: Layout,
    redirect: '/assets/issuers',
    meta: { title: '资产发行管理', icon: 'component', noCache: true },
    children: [
      {
        path: 'index/:issuerId',
        component: () => import('@/views/assets/assets'),
        props: true,
        name: 'assets',
        meta: { title: '资产管理', icon: 'money', noCache: true }
      },
      {
        path: 'issuers',
        component: () => import('@/views/assets/issuers'),
        name: 'issuers',
        meta: { title: '发行人管理', icon: 'peoples', noCache: true }
      },
      {
        path: 'issuer-accounts',
        component: () => import('@/views/assets/issuer_accounts'),
        name: 'issuer-accounts',
        meta: { title: '发行人账户管理', icon: 'tree', noCache: true }
      }
    ]
  },
  {
    path: '/users',
    component: Layout,
    redirect: '/users/index',
    meta: { title: '用户管理', icon: 'peoples', noCache: true },
    children: [
      {
        path: 'index',
        component: () => import('@/views/users/index'),
        props: true,
        name: 'users',
        meta: { title: '用户管理', icon: 'peoples', noCache: true }
      }
    ]
  },
  {
    path: '/news',
    component: Layout,
    redirect: '/news/index',
    meta: { title: '资讯管理', icon: 'documentation', noCache: true },
    children: [
      {
        path: 'index',
        component: () => import('@/views/news/index'),
        name: 'news',
        meta: { title: '行业资讯', icon: 'documentation', noCache: true }
      },
      {
        path: 'detail/:id',
        component: () => import('@/views/news/detail'),
        props: true,
        hidden: true,
        name: 'news-detail',
        meta: { title: '行业资讯', icon: 'documentation', noCache: true }
      }
    ]
  },
  {
    path: '/file',
    component: Layout,
    redirect: '/file/index',
    meta: { title: '文档管理', icon: 'documentation', noCache: true },
    children: [
      {
        path: 'index',
        component: () => import('@/views/file/index'),
        name: 'file',
        meta: { title: '文档管理', icon: 'documentation', noCache: true }
      },
      {
        path: 'detail/:id',
        component: () => import('@/views/file/detail'),
        props: true,
        hidden: true,
        name: 'file-detail',
        meta: { title: '文档管理', icon: 'documentation', noCache: true }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

// 模板自带的路由
export const templateRouterMap = [
  {
    path: '/documentation',
    component: Layout,
    redirect: '/documentation/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/documentation/index'),
        name: 'Documentation',
        meta: { title: 'documentation', icon: 'documentation', noCache: true }
      }
    ]
  },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/guide/index'),
        name: 'Guide',
        meta: { title: 'guide', icon: 'guide', noCache: true }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'pagePermission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'directivePermission'
          // if do not set roles, means: this page does not require permission
        }
      }
    ]
  },

  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/svg-icons/index'),
        name: 'Icons',
        meta: { title: 'icons', icon: 'icon', noCache: true }
      }
    ]
  },

  /** When your routing table is too long, you can split it into small modules**/
  componentsRouter,
  chartsRouter,
  nestedRouter,
  tableRouter,

  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: 'example',
      icon: 'example'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: { title: 'createArticle', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: { title: 'editArticle', noCache: true },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: { title: 'articleList', icon: 'list' }
      }
    ]
  },

  {
    path: '/tab',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/tab/index'),
        name: 'Tab',
        meta: { title: 'tab', icon: 'tab' }
      }
    ]
  },

  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'ErrorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/errorPage/401'),
        name: 'Page401',
        meta: { title: 'page401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/errorPage/404'),
        name: 'Page404',
        meta: { title: 'page404', noCache: true }
      }
    ]
  },

  {
    path: '/error-log',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'log',
        component: () => import('@/views/errorLog/index'),
        name: 'ErrorLog',
        meta: { title: 'errorLog', icon: 'bug' }
      }
    ]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'excel',
      icon: 'excel'
    },
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/exportExcel'),
        name: 'ExportExcel',
        meta: { title: 'exportExcel' }
      },
      {
        path: 'export-selected-excel',
        component: () => import('@/views/excel/selectExcel'),
        name: 'SelectExcel',
        meta: { title: 'selectExcel' }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/uploadExcel'),
        name: 'UploadExcel',
        meta: { title: 'uploadExcel' }
      }
    ]
  },

  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    alwaysShow: true,
    meta: { title: 'zip', icon: 'zip' },
    children: [
      {
        path: 'download',
        component: () => import('@/views/zip/index'),
        name: 'ExportZip',
        meta: { title: 'exportZip' }
      }
    ]
  },

  {
    path: '/theme',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'index',
        component: () => import('@/views/theme/index'),
        name: 'Theme',
        meta: { title: 'theme', icon: 'theme' }
      }
    ]
  },

  {
    path: '/clipboard',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'index',
        component: () => import('@/views/clipboard/index'),
        name: 'ClipboardDemo',
        meta: { title: 'clipboardDemo', icon: 'clipboard' }
      }
    ]
  },

  {
    path: '/i18n',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/i18n-demo/index'),
        name: 'I18n',
        meta: { title: 'i18n', icon: 'international' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/PanJiaChen/vue-element-admin',
        meta: { title: 'externalLink', icon: 'link' }
      }
    ]
  }
]
