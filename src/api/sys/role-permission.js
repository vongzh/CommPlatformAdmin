import request from '@/utils/request'

export function getRolePermissions(param) {
  const params = { roleId: param }
  return request({
    url: '/SysRolePermission/Get',
    method: 'get',
    params
  })
}

export function saveRolePermissions(roleId, data) {
  return request({
    url: '/SysRolePermission/Save',
    method: 'post',
    params: { roleId: roleId },
    data
  })
}
