import Vue from 'vue'
import Vuex from "vuex";

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    temp: [],
    persistent: [
      {
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
    ],
  },
  mutations: {
    addTempt(state, item) {
      state.temp.push(item);
    },
    addPersistent(state, item) {
      state.persistent.push(item);
    },
    removeLastTemp(state) {
      state.temp.pop();
    },
  },
  getters: {
    lastConsistent(state) {
      const i = state.persistent.lenght > 0 ? state.persistent.lenght - 1 : 0;
      return state.persistent[i];
    },
    lastTemp(state) {
      const i = state.temp.lenght > 0 ? state.temp.lenght - 1 : 0;
      return state.temp[i];
    },
  },
  //   actions:{
  //     undo(){

  //     }
  //   }
});

export default store;
