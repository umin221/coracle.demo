/**
 * Created by imac-ret on 17/12/9.
 */
import Vue from 'vue'
import Router from 'vue-router'
import List from '../page/list'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'list',
      component: List
    }
  ]
})
