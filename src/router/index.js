import Vue from 'vue'
import Router from 'vue-router'
import list from '@/pages/list'
import ueditor from '@/pages/ueditor_demo.vue'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: "/list",
    component: list
  }, {
    path: '/list',
    name: 'list',
    component: list
  }, {
    path: '/ueditor',
    name: 'ueditor',
    component: ueditor
  }]
})