<template>
    <div class="modal">
        <div class="title">cretae new node</div>
        <label>
            <span>Enter Node Name</span>
            <input type="text" v-model="name">
        </label>
        <div class="actions">
            <button @click="$emit('close', null)">cancel</button>
            <button @click="$emit('close', name)">add</button>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            name: ''
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