<template>
    <v-card>
        <v-card-title class="text-h5">
           Error
        </v-card-title>

        <v-card-text>
          Only Nodes with more that <b>Two parents</b> are allowed to unlink !
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1"  @click="$emit('close',true)">
                OK
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