import Vue from 'vue'
import Router from 'vue-router'
import list from '@/components/admin/artcle'
import main from '@/components/admin/main'
import login from "@/components/admin/login"
import artcle from "@/components/artcle/artcle"

Vue.use(Router)

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "login",
      component: login
    },
    {
      path: '/admin',
      name: '系统中心',
      component: main,
      iconCls: 'fa fa-address-card',
      meta: {
        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      },
      children: [
        {
          path: '/artcle/list',
          name: '文章管理',
          component: list
        },
      ]
    },{
      path:"/artcle/:id",
      name:"",
      component:artcle
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.length >1 && to.matched[0].meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (window.sessionStorage.token && window.sessionStorage.token.length >= 128) {  // 通过vuex state获取当前的token是否存在
      next();
    }
    else {
      next({
        path: '/',
        query: { redirect: to.fullPath }  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }
  else {
    next();
  }
})

export default router;
