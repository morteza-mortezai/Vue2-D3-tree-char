<template>
    <modal @before-open="onOpen" :name="modalName" class="modal" height="130" width="400">
        <div class="title">Duplicate node</div>
        <label>
            <span>Duplicate Node {{ nodeName }} as :</span>
            <input type="text" v-model="name">
        </label>
        <div class="actions">
            <button @click="$modal.hide(modalName)">cancel</button>
            <button @click="$emit('onAdd', name)">duplicate</button>
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
    props: ['modalName','nodeName'],
    methods:{
        onOpen(){
            this.name=''
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