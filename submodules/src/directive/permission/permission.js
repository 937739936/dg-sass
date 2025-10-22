import store from '@/store'


function checkPermission(el, binding) {
  const { value } = binding
  const roles =  store.getters['user/VUEX_ST_USERAUTH'] || store.state.user.authList
  if (typeof value =='function') {
    const res = value(roles)
    if(!res) {
      el.parentNode && el.parentNode.removeChild(el)
    }
    return
  }
  let _v = value
  if (value && typeof value == 'string') {
    _v = [value]
  }

  if (_v && _v instanceof Array) {
    if (_v.length > 0) {
      const permissionRoles = _v

      const hasPermission = roles.some(role => {
        return permissionRoles.includes(role)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
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