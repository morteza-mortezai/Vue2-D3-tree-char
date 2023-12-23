import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    temp: [],
    saved:{
      data: {
        name: "tree",
        id: 1,
        children: [
          {
            name: "A",
            id: "",
            children: [
              {
                name: "E",
                id: "",
              },
              {
                name: "F",
                id: "",
              },
            ],
          },
          {
            name: "B",
            id: "",
          },
        ],
      },
      links:[
        {from:'1',to:'1-1-2'}
      ]
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
      return state.saved
    },
    lastTemp(state) {
      const i = state.temp.length > 0 ? state.temp.length - 1 : 0;
      return state.temp[i];
    },
  },
});

export default store;
