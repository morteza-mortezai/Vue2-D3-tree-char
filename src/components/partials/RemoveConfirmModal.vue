<template>
    <v-card>
        <v-card-title class="text-h5">
           Remove ?
        </v-card-title>

        <v-card-text>
          Are You Sure to Remove Node {{ name }} ?>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="danger" text @click="$emit('close')">
                No
            </v-btn>

            <v-btn color="success"  @click="$emit('close',true)">
                Yes
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
export default {
    data() {
        return {
            name: ''
        }
    },
    props:['Name']
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