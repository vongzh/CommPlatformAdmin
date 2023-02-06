import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import auth from './auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({
  showSpinner: false
})

const whiteList = ['/login', '/register', '/quickregister', '/forgetpwd', '/wechat/redirect', '/third/autoregister']

const moduleType = {
  PAGE: 10,
  API: 20
}

router.beforeEach(async(to, from, next) => {
  document.title = getPageTitle(to.meta.title)

  // 进度条
  NProgress.start()

  const hasCustomerAuth = auth.IsCustomerAuthorization()
  if (!hasCustomerAuth) {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
    NProgress.done()
    return
  }

  if (to.path === '/500') {
    next()
    NProgress.done()
    return
  }

  if (to.path === '/login') {
    next({
      path: '/'
    })
    NProgress.done()
    return
  }

  const hasUserInfo = store.state.user.name
  if (!hasUserInfo) {
    try {
      // 用户信息
      const userInfo = await store.dispatch('user/getInfo')
      // 路由
      const accessRoutes = await store.dispatch('permission/generateRoutes', userInfo.roleMenus)
      router.addRoutes(accessRoutes)
      // 系统模块
      await store.dispatch('sys/loadModules')
      // 访问
      next({ ...to,
        replace: true
      })
    } catch (error) {
      next('/500')
    } finally {
      NProgress.done()
    }
    return
  }

  try {
    const permissionModules = store.state.sys.permissionModules.filter(m => m.type === moduleType.PAGE)
    const userModules = store.state.user.modules.filter(m => m.type === moduleType.PAGE)
    if (permissionModules.some(x => x.meta === to.name)) {
      if (userModules.some(x => x.meta === to.name)) {
        next()
      } else {
        next('/401')
      }
    } else {
      next()
    }
  } catch (error) {
    next('/500')
  } finally {
    NProgress.done()
  }
})

router.afterEach(() => {
  NProgress.done()
})
