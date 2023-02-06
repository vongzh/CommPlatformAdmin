import {
  asyncRouterMap,
  constantRoutes
} from '@/router'

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const menuLevel = {
  level1: 1,
  level2: 2,
  level3: 3
}

const YN = {
  Y: 1,
  N: 0
}

const actions = {
  generateRoutes({
    commit
  }, menus) {
    return new Promise(resolve => {
      const accessedRoutes = []
      // 一级菜单
      var level1Menu = menus.filter(x => {
        return x.level === menuLevel.level1 && x.enabled === YN.Y
      }).sort((x, y) => {
        return x.sort - y.sort
      })
      level1Menu.forEach(menu => {
        const route = {
          name: menu.name,
          path: menu.path,
          alwaysShow: menu.alwaysShow === YN.Y,
          component: asyncRouterMap.get(menu.component) || asyncRouterMap.get('Root'),
          hidden: menu.visiable === YN.N,
          meta: {
            title: menu.title,
            icon: menu.icon,
            breadcrumb: menu.breadcrumbShow === YN.Y
          },
          children: []
        }
        if (menu.redirect) { route.redirect = menu.redirect }

        // 二级菜单
        var level2Menu = menus.filter(x => {
          return x.parentId === menu.id && x.enabled === YN.Y
        }).sort((x, y) => {
          return x.sort - y.sort
        })
        level2Menu.forEach(itemMenu => {
          if (asyncRouterMap.get(itemMenu.component)) {
            const itemRoute = {
              name: itemMenu.name,
              path: itemMenu.path,
              alwaysShow: itemMenu.alwaysShow === YN.Y,
              component: asyncRouterMap.get(itemMenu.component) || asyncRouterMap.get('Root'),
              hidden: itemMenu.visiable === YN.N,
              meta: {
                title: itemMenu.title,
                keepAlive: true,
                icon: itemMenu.icon,
                breadcrumb: itemMenu.breadcrumbShow === YN.Y
              }
            }
            if (menu.redirect) { route.redirect = menu.redirect }
            route.children.push(itemRoute)
          } else {
            const itemRoute = {
              name: itemMenu.name,
              path: itemMenu.path,
              alwaysShow: itemMenu.alwaysShow === YN.Y,
              redirect: '/404',
              hidden: itemMenu.visiable === YN.N,
              meta: {
                keepAlive: true,
                title: itemMenu.title,
                icon: itemMenu.icon,
                breadcrumb: itemMenu.breadcrumbShow === YN.Y
              }
            }
            route.children.push(itemRoute)
          }
        })
        accessedRoutes.push(route)
      })
      accessedRoutes.push({
        path: '*',
        redirect: '/404',
        hidden: true
      })

      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
