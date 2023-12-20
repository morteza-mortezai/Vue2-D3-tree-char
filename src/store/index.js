import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    temp: [],
    saved: {
      name: "tree",
      id: 1,
      children: [
        {
          name: "A",
          id: "",
        },
        {
          name: "B",
          id: "",
        },
      ],
    },
  },
  mutations: {
    addTempt(state, item) {
      state.temp.push(item);
    },
    save(state, item) {
      state.saved=item
    },
    removeLastTemp(state) {
      state.temp.pop();
    },
    clearTemp(state){
      state.temp=[]
    }
  },
  getters: {
    lastSaved(state) {
      // const i = state.persistent.length > 0 ? state.persistent.length - 1 : 0;
      return state.saved
    },
    lastTemp(state) {
      const i = state.temp.length > 0 ? state.temp.length - 1 : 0;
      return state.temp[i];
    },
  },
  //   actions:{
  //     undo(){

  //     }
  //   }
});

export default store;
