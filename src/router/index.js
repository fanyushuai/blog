import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import list from '@/admin/list.vue'
import Main from '@/components/Main'
import Contract from '@/components/system/Contract'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },{
      path: '/list',
      name: 'list',
      component: list
    },{
      path: '/system',
      name: '系统中心',
      component: Main,
      iconCls: 'fa fa-address-card',
      children: [{
          path: '/system/contract',
          component: Contract,
          name: '联系人管理'
      }]
    }
  ]
})
