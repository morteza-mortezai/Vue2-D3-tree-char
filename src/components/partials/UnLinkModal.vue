<template>
    <modal :name="modalName" @before-open="onOpened" class="modal" height="300" width="400">
        <v-card elevation="0">
            <v-card-title class="text-h5">
                UnLink Node {{ selectedNode?.name }} from
            </v-card-title>
            <v-card-text>
                <v-radio-group v-model="nodeId" >
                    <!-- <v-radio  :label="parent.name" :value="parent.id"></v-radio> -->
                    <v-radio v-for="p in parents" :key="p.id" :label="` ${p.name}`" :value="p.id"></v-radio>
                </v-radio-group>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="error" text @click="$modal.hide(modalName)">
                    cancel
                </v-btn>

                <v-btn color="success" @click="onUnLink">
                    OK
                </v-btn>
            </v-card-actions>
        </v-card>
    </modal>
</template>
<script>
export default {
    data() {
        return {
            nodeId: '',
            // items: [],
     
        }
    },
    props: ['modalName', 'selectedNode', 'graph','parents'],
    computed:{
        // parent(){
        //     if(this.selectedNode?.id){
        //         return this.reverseParentFinder(this.graph,this.selectedNode.id)
        //     }
        //     return null
        // }
    },
    methods: {
        onOpened() {
            this.nodeId = ''
            // this.flat(this.graph)
        },
        onUnLink() {
            this.$emit('onUnLink', this.nodeId)
        },
        // flat(obj) {
        //     if (obj) {
        //         this.items.push({ name: obj.name, id: obj.id })
        //         if (obj.children) {
        //             obj.children.forEach(child => {
        //                 this.flat(child)
        //             });
        //         }
        //     }
        // }
        reverseParentFinder(obj, id) {
            if (obj.children) {
                const found = obj.children.find(item => item.id == id)
                if (found) {
                    return obj
                }
                for (let i = 0; i < obj.children.length; i++) {
                    const child = obj.children[i]
                    const f = this.reverseParentFinder(child, id)
                    if (f) {
                        return f
                    }
                }
            }

        },
    }
}
</script> 
<style scoped>
.v-card{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
</style>