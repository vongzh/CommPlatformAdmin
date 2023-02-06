import request from '@/utils/request'

export function getUserGroupUsers(id) {
  return request({
    url: '/SysUserGroupUser/Get',
    method: 'get',
    params: {
      groupId: id
    }
  })
}

export function getUserGroups(userId) {
  return request({
    url: '/SysUserGroupUser/GetUserGroups',
    method: 'get',
    params: {
      userId: userId
    }
  })
}

export function saveUserGroupUsers(groupId, data) {
  return request({
    url: '/SysUserGroupUser/Save',
    method: 'post',
    params: {
      groupId: groupId
    },
    data
  })
}

export function saveUserGroups(userId, data) {
  return request({
    url: '/SysUserGroupUser/SaveUserGroups',
    method: 'post',
    params: {
      userId: userId
    },
    data
  })
}
