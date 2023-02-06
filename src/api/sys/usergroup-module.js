import request from '@/utils/request'

export function getUserGroupModules(id) {
  return request({
    url: '/SysUserGroupModule/Get',
    method: 'get',
    params: {
      groupId: id
    }
  })
}

export function saveUserGroupModules(groupId, data) {
  return request({
    url: '/SysUserGroupModule/Save',
    method: 'post',
    params: {
      groupId: groupId
    },
    data
  })
}
