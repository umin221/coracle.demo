// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '../App'
import router from './router'
import { Header, Button, Cell, TabContainer, TabContainerItem } from 'mint-ui'
// import MintUi from 'mint-ui'

// Vue.use(MintUi)

Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Cell.name, Cell)
Vue.component(TabContainer.name, TabContainer)
Vue.component(TabContainerItem.name, TabContainerItem)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
