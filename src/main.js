import Vue from 'vue'
import App from './App.vue'
import VModal from 'vue-js-modal/dist/index.nocss.js'
import 'vue-js-modal/dist/styles.css'
import vuetify from './plugins/vuetify'
// import VueContext from 'vue-context';

Vue.config.productionTip = false
Vue.use(VModal)
new Vue({
  vuetify,

  // components: {
  //   VueContext,
  // },

  // methods: {
  //   onClick(text) {
  //       alert(`You clicked ${text}!`);
  //   }},
  render: h => h(App)
}).$mount('#app')


