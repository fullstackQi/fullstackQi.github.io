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
let ethereum = window.ethereum
Vue.prototype.ethereum = ethereum
if (typeof ethereum == undefined) {
  alert('请安装metamask')
}
var isBscMainnet = false

ethereum.request({
  method: 'net_version'
}).then((networkVersion) => {
  if (ethereum.networkVersion != '56') {
    alert('请连接BSC主网')
  } else {
    ethereum.enable().then(()=>{
      const web3 = new Web3(ethereum)
      Vue.prototype.web3 = web3
      ethereum.request({
        method: 'eth_accounts'
      }).then((accounts) => {
        Vue.prototype.currentAccount = accounts[0]
        new Vue({
          render: h => h(App),
          router
        }).$mount('#app')
      })
      .catch(console.error);
    })
  }
})





