import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Element from 'element-ui'
import './styles/element-variables.scss'
import '@/styles/index.scss' // global css
import Web3 from "web3"

Vue.config.productionTip = false
Vue.use(Element, {
  size: 'medium'
})
const web3 = new Web3('https://bsc-dataseed4.defibit.io')
Vue.prototype.web3 = web3
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
