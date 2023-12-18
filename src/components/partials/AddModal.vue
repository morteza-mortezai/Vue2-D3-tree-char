<template>
    <modal :name="modalName" class="modal" height="130" width="400">
        <div class="title">cretae new node</div>
        <label>
            <span>Enter Node Name</span>
            <input type="text" v-model="name">
        </label>
        <div class="actions">
            <button @click="$modal.hide(modalName)">cancel</button>
            <button @click="$emit('onAdd', name)">add</button>
        </div>
    </modal>
</template>
<script>
export default {
    data() {
        return {
            name: ''
        }
    },
    props:['modalName']
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