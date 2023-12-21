<template>
    <modal :name="modalName" @before-open="onOpened" class="modal" height="200" width="400">
        <v-card elevation="0">
            <v-card-title class="text-h5">
                Link Node {{ nodeName }} to
            </v-card-title>
            <v-card-text>
                <v-select :items="items" label="Select Node" item-text="name" item-value="id" v-model="nodeId"></v-select>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="error" text @click="$modal.hide(modalName)">
                    cancel
                </v-btn>

                <v-btn color="success" @click="onAdd">
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
            items: []
        }
    },
    props: ['modalName', 'nodeName', 'graph'],
    methods: {
        onOpened() {
            this.nodeId = ''
            this.flat(this.graph)
        },
        onAdd() {
            this.$emit('onLink', this.nodeId)
        },
        flat(obj) {
            if (obj) {
                this.items.push({ name: obj.name, id: obj.id })
                if (obj.children) {
                    obj.children.forEach(child => {
                        this.flat(child)
                    });
                }
            }
        }
    }
}
</script> 
<style scoped>
.modal {
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}

.modal .title {}

.modal .actions {

    display: flex;
    justify-content: end;
}
</style>