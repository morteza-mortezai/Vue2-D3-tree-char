<template>
    <vue-context ref="menu">
        <!-- class="mx-2" -->
        <v-btn class="mx-1" @click.prevent="onContext(action.name)" v-for="action in actions" x-small fab :key="action.name"
            :color="action.color">
            <v-icon dark>
                mdi-{{ action.icon }}
            </v-icon>
        </v-btn>
        <!-- <li>
            <a >Add</a>
        </li>
        <li>
            <a @click.prevent="onContext($event.target.innerText)">Remove</a>
        </li> -->
    </vue-context>
</template>
<script>
import VueContext from 'vue-context';
export default {
    expose: ['show','hide'],
    components: {
        VueContext,
    },
    data() {
        return {
            actions: [
                { name: 'add', icon: 'plus', color: 'primary' },
                { name: 'remove', icon: 'minus', color: 'danger' },
            ]
        }
    },
    methods: {
        onContext(action) {
            this.$emit('context', action)
        },
        show(e) {
            this.$refs.menu.open(e)
        },
        hide() {
            this.$nextTick( ()=>{
                this.$refs.menu.close()
            })
        }
    }
}
</script>
<style scoped>
.v-context {
    position: absolute;
    background-color: white;
    padding: 8px;
    list-style: none;
    cursor: pointer;
}

/* .v-context li{
    padding: 0 20px;
  }
  .v-context li:hover{
    background-color: blue;
  } */
</style>