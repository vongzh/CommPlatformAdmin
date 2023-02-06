import request from '@/utils/request'

export function CheckUserMobileIsExist(mobile) {
  return request({
    url: '/Customer/CheckUserMobileIsExist',
    method: 'get',
    async: false,
    params: {
      mobile
    }
  })
}

export function CheckUserNameIsExist(userName) {
  return request({
    url: '/Customer/CheckUserNameIsExist',
    method: 'get',
    async: false,
    params: {
      userName
    }
  })
}

export function QuickRegister(data) {
  return request({
    url: '/Customer/QuickRegister',
    method: 'post',
    data: data
  })
}

export function Captcha(mobile, type, randstr, ticket, ret) {
  return request({
    url: '/Customer/Captcha',
    method: 'get',
    params: {
      mobile,
      type,
      randstr,
      ticket,
      ret
    }
  })
}

export function VerifyCaptcha(uin, code, type) {
  return request({
    url: '/Customer/VerifyCaptcha',
    method: 'get',
    params: {
      uin,
      code,
      type
    }
  })
}

export function SaveCustomerInfo(data) {
  data.type = 3
  return request({
    url: '/Customer/SaveCustomerInfo',
    method: 'post',
    data: data
  })
}

export function AddCustomerInfo(data) {
  data.type = 3
  return request({
    url: '/Customer/AddCustomerInfo',
    method: 'post',
    data: data
  })
}

export function GetCustomer() {
  return request({
    url: '/Customer/GetCustomer',
    method: 'post'
  })
}

export function GetCustomerResponse(customerNo) {
  return request({
    url: '/Customer/GetCustomerResponse',
    method: 'post',
    params: {
      customerNo
    }
  })
}
export function QueryAccountInfo(accountCode) {
  return request({
    url: '/AccountInfo/QueryAccountInfo',
    method: 'post',
    params: {
      accountCode
    }
  })
}

export function GetCustomers(data) {
  return request({
    url: '/Customer/GetCustomers',
    method: 'post',
    data: data
  })
}

export function AuditCustomer(params) {
  return request({
    url: '/Customer/AuditCustomer',
    method: 'post',
    params: params
  })
}

export function ImpowerCustomer(customerNo) {
  return request({
    url: '/Customer/Impower',
    method: 'post',
    params: {
      customerNo
    }
  })
}

export function FindPwd(mobile, randstr, ticket, ret) {
  return request({
    url: '/Customer/FindPwd',
    method: 'get',
    params: {
      mobile,
      randstr,
      ticket,
      ret
    }
  })
}

export function ResetPwd(mobile, pwd, requestId) {
  return request({
    url: '/Customer/ResetPwd',
    method: 'get',
    params: {
      mobile,
      pwd,
      requestId
    }
  })
}

export function CheckIdentity(mobile, realName, identity) {
  return request({
    url: '/Customer/CheckIdentity',
    method: 'get',
    params: {
      mobile,
      realName,
      identity
    }
  })
}

export function CheckCustomer(mobile) {
  return request({
    url: '/Customer/CheckCustomer',
    method: 'get',
    params: {
      mobile
    }
  })
}

export function SendMail(data, type) {
  return request({
    url: '/Customer/SendMail',
    method: 'post',
    params: {
      mailAddr: data,
      type: type
    }
  })
}

export function CheckIdCardNoIsExist(idCardNo) {
  return request({
    url: '/Customer/CheckIdCardNoIsExist',
    method: 'get',
    async: false,
    params: {
      idCardNo
    }
  })
}

export function CheckLicenseNoIsExist(licenseNo) {
  return request({
    url: '/Customer/CheckLicenseNoIsExist',
    method: 'get',
    async: false,
    params: {
      licenseNo
    }
  })
}

export function ChangeContactInfo(contact, contactPhone) {
  return request({
    url: '/Customer/ChangeContactInfo',
    method: 'post',
    params: {
      contact,
      contactPhone
    }
  })
}

export function ChangeEmail(email, captchaCode) {
  return request({
    url: '/Customer/ChangeEmail',
    method: 'post',
    params: {
      email,
      captchaCode
    }
  })
}

