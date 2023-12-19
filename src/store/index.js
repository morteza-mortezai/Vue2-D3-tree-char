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
            children: [
              {
                name: "B",
                children: [
                  { name: "C", id: 3938 },
                  { name: "D", id: 3534 },
                ],
              },
              {
                name: "H",
                children: [
                  { name: "D", id: 3534 },
                  { name: "E", id: 5731 },
                  { name: "F", id: 7840 },
                ],
              },
            ],
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
    removeLastPersistent(state) {
      state.temp.pop();
    },
  },
  getters: {
    lastConsistent(state) {
      const i = state.persistent.lenght > 0 ? state.persistent.lenght - 1 : 0;
      return state.persistent[i];
    },
    lastTempt(state) {
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
