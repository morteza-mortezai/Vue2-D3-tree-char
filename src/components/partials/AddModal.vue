<template>
    <modal :name="modalName" @before-open="onOpened" class="modal" height="200" width="400">
        <v-card elevation="0">
            <v-card-title class="text-h5">
                cretae new node
            </v-card-title>

            <v-card-text>
                <v-text-field label="Enter Node Name" @keypress.enter="onAdd" type="text" v-model="name"></v-text-field>
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
        <!-- <div class="title">cretae new node</div>
        <label>
            <span>Enter Node Name</span>
            <input @keypress.enter="onAdd" type="text" v-model="name">
        </label>
        <div class="actions">
            <button @click="$modal.hide(modalName)">cancel</button>
            <button @click="onAdd">add</button>
        </div> -->
    </modal>
</template>
<script>
export default {
    data() {
        return {
            name: ''
        }
    },
    props: ['modalName'],
    methods: {
        onOpened() {
            this.name = ''
        },
        onAdd() {
            this.$emit('onAdd', this.name)
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