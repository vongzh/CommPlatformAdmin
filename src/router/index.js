import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
  path: '/login',
  component: () => import('@/views/login/v1'),
  hidden: true
},
{
  path: '/register',
  component: () => import('@/views/register'),
  hidden: true
},
{
  path: '/quickregister',
  component: () => import('@/views/register/quickregister'),
  hidden: true
},
{
  path: '/forgetpwd',
  component: () => import('@/views/forgetpwd'),
  hidden: true
},
{
  path: '/wechat/redirect',
  component: () => import('@/views/wechat/redirect'),
  hidden: true
},
{
  path: '/third/autoregister',
  component: () => import('@/views/extend/autoregister'),
  hidden: true
},
{
  path: '/user',
  component: Layout,
  redirect: '/user/profile',
  hidden: true,
  children: [{
    path: 'profile',
    component: () => import('@/views/profile'),
    name: 'Profile',
    meta: {
      title: '账号信息',
      icon: 'user',
      noCache: true
    }
  }]
},

// 外部临时
// {
//   path: '/paylink/:group',
//   name: "支付",
//   component: () => import('@/views/extend/submit'),
// },
// {
//   path: '/paylinklist/:group',
//   name: "支付列表",
//   component: () => import('@/views/extend/list'),
// },
// {
//   path: '/customer',
//   component: Layout,
//   redirect: '/customer/info',
//   hidden: true,
//   children: [{
//     path: 'info',
//     component: () => import('@/views/customer'),
//     name: 'CustomerInfo',
//     meta: {
//       title: '账户资料',
//       icon: 'user',
//       noCache: true
//     }
//   }]
// },
// {
//   path: '/recharge',
//   component: Layout,
//   hidden: true,
//   children: [{
//     path: '/recharge',
//     component: () => import('@/views/finance/recharge')
//   }]
// },
// {
//   path: '/reconciliation',
//   component: Layout,
//   hidden: true,
//   children: [{
//     path: '/reconciliation',
//     component: () => import('@/views/finance/reconciliation')
//   }]
// },
// {
//   path: '/compensation',
//   component: Layout,
//   hidden: true,
//   children: [{
//     path: '/compensation',
//     component: () => import('@/views/finance/compensation')
//   }]
// },
// {
//   path: '/account/add',
//   component: Layout,
//   hidden: true,
//   children: [{
//     path: '/account/add',
//     component: () => import('@/views/user/account/add')
//   }]
// },
// {
//   path: '/account/list',
//   component: Layout,
//   hidden: true,
//   children: [{
//     path: '/account/list',
//     component: () => import('@/views/user/account/list')
//   }]
// },
// {
//   path: '/company/add',
//   component: Layout,
//   hidden: true,
//   children: [{
//     path: '/company/add',
//     component: () => import('@/views/user/company/add')
//   }]
// },
// {
//   path: '/company/list',
//   component: Layout,
//   hidden: true,
//   children: [{
//     path: '/company/list',
//     component: () => import('@/views/user/company/list')
//   }]
// },
{
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path*',
    component: () => import('@/views/redirect/index')
  }]
},
{
  path: '/404',
  component: Layout,
  hidden: true,
  children: [{
    path: '/404',
    component: () => import('@/views/error-page/404')
  }]
},
{
  path: '/401',
  component: Layout,
  hidden: true,
  children: [{
    path: '/401',
    component: () => import('@/views/error-page/401')
  }]
},
{
  path: '/500',
  component: () => import('@/views/error-page/500'),
  hidden: true
}
]

export const asyncRouterMap = new Map([
  [
    'Root',
    Layout
  ],
  [
    'Layout',
    Layout
  ],
  [
    'Dashboard',
    require('@/views/dashboard').default
  ],
  // [
  //   'CustomerInfo',
  //   require('@/views/customer').default
  // ],

  [
    // 个人
    'PensonnalCustomer',
    require('@/views/customer/person').default
  ],
  [
    // 企业
    'CompanyCustomer',
    require('@/views/customer/company').default
  ],
  /**
   * 酒店列表
   */
  [
    'HotelList',
    require('@/views/hotellist').default
  ],
  [
    'Hotel',
    require('@/views/hotellist/detail/v1').default
  ],
  /**
   * 订单
   */
  [
    'AllOrderList',
    require('@/views/order/all-order/list').default
  ],
  [
    'AllOrderDetail',
    require('@/views/order/all-order/detail').default
  ],
  [
    'ManualOrderList',
    require('@/views/order/manual-order/list').default
  ],
  [
    'ManualWaitHandleOrderList',
    require('@/views/order/manual-process-order/list').default
  ],
  [
    'ManualOrderDetail',
    require('@/views/order/manual-order/detail/v1').default
  ],
  [
    'SysOrderList',
    require('@/views/order/sys-order/list').default
  ],
  [
    'SysWaitHandleOrderList',
    require('@/views/order/sys-process-order/list').default
  ],
  [
    'SysOrderDetail',
    require('@/views/order/sys-order/detail').default
  ],
  [
    'OrderContacted',
    require('@/views/order/order-contacted').default,
  ],
  /**
   * 售后
   */
  [
    'PreSalesList',
    require('@/views/sales/pre-sales/list').default
  ],
  [
    'PreSalesDetail',
    require('@/views/sales/pre-sales/detail').default
  ],
  [
    'AfterSalesList',
    require('@/views/sales/after-sales/list').default
  ],
  [
    'AfterSalesDetail',
    require('@/views/sales/after-sales/detail').default
  ],
  [
    'AfterSaleList',
    require('@/views/purchase/aftersale').default
  ],
  [
    'AfterSaleDetail',
    require('@/views/purchase/aftersale/detail').default
  ],
  [
    'AfterSalesRefundList',
    require('@/views/sales/after-sales-refund/list').default
  ],
  /**
   * 财务
   */
  [
    'FinanceAccount',
    require('@/views/finance/account').default
  ],
  [
    'FinanceInvoice',
    require('@/views/finance/invoice').default
  ],
  [
    'FinancePurchaseOrderList',
    require('@/views/finance/purchase-order/list').default
  ],
  [
    'FinanceCustomerAccount',
    require('@/views/purchase/account').default
  ],
  [
    'FinanceBillList',
    require('@/views/finance/billList').default
  ],
  [
    'MakeOutInvoice',
    require('@/views/finance/make-out-invoice').default
  ],
  [
    'InvoiceList',
    require('@/views/finance/invoice-list').default
  ],
  [
    'InvoiceListDetail',
    require('@/views/finance/invoice-list/detail').default
  ],
  /**
   * 用户
   */
  [
    'CustomerAdd',
    require('@/views/user/customer/add').default
  ],
  [
    'SysUserList',
    require('@/views/user/internal-user/list').default
  ],
  [
    'CustomerList',
    require('@/views/user/customer/list').default
  ],
  [
    'CustomerDetail',
    require('@/views/user/customer/detail').default
  ],
  [
    //子账号列表
    'SubAccountList',
    require('@/views/user/subaccount/list').default
  ],
  [
    //子账号列表详情
    'SubAccountDetail',
    require('@/views/user/subaccount/detail').default
  ],
  [
    'ChildAccount',
    require('@/views/user/childAccount').default
  ],
	


  [
    'RegisterUserList',
    require('@/views/user/register-user/list').default
  ],
  [
    'InternalUserDetail',
    require('@/views/user/internal-user/detail').default
  ],
  /**
   * 系统
   */
  [
    'Menu',
    require('@/views/sys/menu').default
  ],
  [
    'Role',
    require('@/views/sys/role').default
  ],
  [
    'UserGroup',
    require('@/views/sys/user-group').default
  ],
  [
    'Module',
    require('@/views/sys/module').default
  ],
  [
    'Department',
    require('@/views/sys/department').default
  ],
  /**
   * 通用管理
   */
  [
    'Message',
    require('@/views/public/message').default
  ],
  [
    'Notice',
    require('@/views/purchase/notice').default
  ],
  [
    'NoticeDetail',
    require('@/views/purchase/notice/detail').default
  ],

  [
    'NoticeManager',
    require('@/views/public/notice').default
  ],
  [
    'NoticePublish',
    require('@/views/public/notice/publish').default
  ],
  /**
   * 采购
   */
  [
    'Booking',
    require('@/views/purchase/booking/v1').default
  ],
  [
    'Payment',
    require('@/views/purchase/payment').default
  ],
  [
    'AliPay',
    require('@/views/purchase/payment/alipay').default
  ],
  [
    'Order',
    require('@/views/purchase/order/v1').default
  ],
  [
    'OrderList',
    require('@/views/purchase/orderlist').default
  ],
  [
    'RefundList',
    require('@/views/purchase/refundlist').default
  ],
  [
    'Invoice',
    require('@/views/purchase/invoice').default
  ],
  /**
   * 酒店
   */
  [
    'HotelMatchManage',
    require('@/views/hotel/hotelmatch').default
  ],
  [
    'HotelListManager',
    require('@/views/hotel/hotel').default
  ],
  [
    'PlatformHotelListManager',
    require('@/views/hotel/platformhotel').default
  ],
  [
    'HotelBlackList',
    require('@/views/hotel/hotel-blacklist').default
  ],
  [
    'RoomTypeBlackList',
    require('@/views/hotel/roomtype-blacklist').default
  ],
  /**
   * 短信
   */
  [
    'SMSList',
    require('@/views/sms/list').default
  ],
  [
    'SMSTemplate',
    require('@/views/sms/template').default
  ],
  /**
   * 系统日志
   */
  [
    'LoginLog',
    require('@/views/syslog/login').default
  ],
  [
    'OperationLog',
    require('@/views/syslog/operation').default
  ],
  /**
   * 系统配置
   */
  [
    'HotelOffer',
    require('@/views/sysconfig/hotelOffer').default
  ],
  [
    'OrderShunt',
    require('@/views/sysconfig/orderShunt').default
  ],
  [
    'OrderPurchaseMethod',
    require('@/views/sysconfig/orderPurchaseMethod').default
  ],
  [
    'DataConfig',
    require('@/views/sysconfig/dataconfig').default
  ],
  [
    'Throttle',
    require('@/views/sysconfig/throttle').default
  ],
  /**
  * 支付提交
  */
 [
   'PayLink',
   require('@/views/extend/submit').default
 ],
 [
   'PayLinkList',
   require('@/views/extend/list').default
 ],

 /**
  * 课程
  */
 [
  'CourseList',
  require('@/views/course').default
],
[
  'SchemeList',
  require('@/views/scheme').default
]
])

const createRouter = () => new Router({
  mode: 'history',
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
