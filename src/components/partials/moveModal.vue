<template>
    <modal @opened="flat(graph)" :name="modalName" class="modal" height="430" width="400">
        <div class="title">Move node</div>
        <label>
            <span>Move Node {{ nodeName }} to :</span>
            <v-select :items="items" label="Standard" item-text="name" item-value="id" v-model="name"></v-select>
        </label>
        <div class="actions">
            <button @click="$modal.hide(modalName)">cancel</button>
            <button @click="$emit('onMove', name)">Move</button>
        </div>
    </modal>
</template>
<script>
export default {
    data() {
        return {
            name: '',
            items:[]
        }
    },
    props: ['modalName', 'nodeName', 'graph'],
    methods: {
        flat(obj) { 
            if(obj){
                this.items.push({name:obj.name,id:obj.id})
                if(obj.children){
                    obj.children.forEach(child => {
                        this.flat(child)
                    });
                }
            }
        }
    },
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