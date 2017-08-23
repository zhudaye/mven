// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import iview from 'iview'
import router from './router'
import VueResource from 'vue-resource'
import websocket from 'vue-websocket'
import vuex from 'vuex'
import store from './vuex/vuexmain'
Vue.use(VueResource)
Vue.use(iview)
Vue.use(vuex)
Vue.use(websocket, 'ws://localhost:3001')
router.beforeEach((to, from, next) => {
  iview.LoadingBar.start()
  next()
})

router.afterEach((to, from, next) => {
  iview.LoadingBar.finish()
})

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
