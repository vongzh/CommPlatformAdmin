import request from '@/utils/request'

export function GetDepartments(data) {
  return request({
    url: '/SysDepartment/Query',
    method: 'post',
    data: data
  })
}

export function GetEmployees(deptId) {
  return request({
    url: '/SysUser/GetUsersByDeptId',
    method: 'get',
    params: {
      deptId
    }
  })
}

export function SyncDepartments() {
  return request({
    url: '/SysDepartment/Sync',
    method: 'post'
  })
}

export function SyncEmployees(departmentId) {
  return request({
    url: '/SysDepartment/SyncEmployees',
    method: 'post',
    params: {
      departmentId: departmentId || ''
    }
  })
}
