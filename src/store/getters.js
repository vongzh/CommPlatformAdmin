const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  errorLogs: state => state.errorLog.logs,
  sysUser: state => state.user.user,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  menus: state => state.user.menus,
  modules: state => state.user.modules,
  permission_routes: state => state.permission.routes,
  session: state => state.user.session,
  client_token: state => state.client.client_token,
  city: state => state.condition.city,
  search: state => state.condition.search,
  permissionModules: state => state.sys.permissionModules
}
export default getters
