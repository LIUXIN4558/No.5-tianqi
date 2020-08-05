import Vue from 'vue'
import App from './App.vue'
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
import axios from 'axios'
Vue.prototype.$ajax=axios
import { Area } from 'vant'
Vue.use(Area)
import { Popup } from 'vant'
Vue.use(Popup)
import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);

Vue.config.productionTip = false

new Vue({
  render: function (h) { return h(App) },
}).$mount('#app')
