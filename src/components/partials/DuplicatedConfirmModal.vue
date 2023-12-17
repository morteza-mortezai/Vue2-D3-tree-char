<template>
    <v-card>
        <v-card-title class="text-h5">
           Duplicated
        </v-card-title>

        <v-card-text>
          This Name exist already ,Please choose another one
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="green darken-1" text @click="$emit('close')">
                Cancel
            </v-btn>

            <v-btn color="green darken-1"  @click="$emit('close')">
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