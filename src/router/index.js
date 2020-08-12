import Vue from 'vue'
import Router from 'vue-router'
import list from '@/admin/list.vue'
import Main from '@/components/Main'
import Contract from '@/components/system/Contract'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '系统中心',
      component: Main,
      iconCls: 'fa fa-address-card',
      children: [
        {
          path: '/system/contract',
          component: Contract,
          name: '联系人管理'
        },
        {
          path: '/list',
          name: '文章管理',
          component: list
        },
      ]
    }
  ]
})
