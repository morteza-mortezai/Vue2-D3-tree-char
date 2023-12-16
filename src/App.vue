<template>
  <v-app>
    <v-main>
      <Graph />
    </v-main>
  </v-app>
</template>

<script>
import Graph from './components/Graph.vue';

export default {
  name: 'App',

  components: {
    Graph,
  },

  data: () => ({
    //
  }),
};
</script>
