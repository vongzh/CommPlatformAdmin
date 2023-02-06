import store from '@/store'

var checkPermission = (el, binding) => {
  const { value } = binding
  const sysModules = store.getters && store.getters.modules
  const modules = sysModules.map(m => {
    return m.meta
  })

  if (value && value instanceof Array && value.length > 0) {
    const permissionModules = value

    const hasPermission = modules.some(module => {
      return permissionModules.includes(module)
    })

    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  } else {
    throw new Error(`need modules! Like v-permission="['editor']"`)
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
