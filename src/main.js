import Vue from 'vue'
import App from './App.vue'
import VModal from 'vue-js-modal/dist/index.nocss.js'
import 'vue-js-modal/dist/styles.css'
import vuetify from './plugins/vuetify'
// import VueContext from 'vue-context';
import Vuex from 'vuex'
import store from './store/index.js'

Vue.use(Vuex)
Vue.config.productionTip = false
Vue.use(VModal, { dialog: true })
new Vue({
  vuetify,
store,
  // components: {
  //   VueContext,
  // },

  // methods: {
  //   onClick(text) {
  //       alert(`You clicked ${text}!`);
  //   }},
  render: h => h(App)
}).$mount('#app')


