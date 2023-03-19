<template>
  <v-card class="mx-auto" width="500">
    <v-toolbar color="blue">
      <v-toolbar-title>Create new To-Do List</v-toolbar-title>
    </v-toolbar>

    <v-form @submit.prevent="createList" class="p-3">
      <v-text-field
        clearable
        label="List Name"
        variant="solo"
        v-model="listName"
        :hide-details="true"
      ></v-text-field>
      <small class="p-2 text-red" v-for="error in v$.listName.$errors" :key="error.$uid">
        {{ error.$message }}</small
      >
      <v-btn type="submit" block class="mt-3">Submit</v-btn>
    </v-form>
    <v-divider></v-divider>
    <v-row class="align-center w-100 mt-3 m-0">
      <div class="text-center w-100 pb-3" v-if="toDoListsStore.isLoading">
        <v-progress-circular indeterminate color="blue"></v-progress-circular>
      </div>
      <v-list v-else class="w-100">
        <p class="text-center" v-if="toDoListsStore.toDoLists.length === 0">No lists.</p>

        <router-link
          v-else
          class="w-100"
          v-for="list in toDoListsStore.toDoLists"
          :key="list.id"
          :to="{
            name: 'todo-detail',
            params: { id: list.id, name: list.name }
          }"
        >
          <v-list-item>
            <template v-slot:prepend="{}">
              <v-list-item-action start>
                <v-btn flat color="black" variant="plain" size="small" icon="mdi-pencil"></v-btn>
              </v-list-item-action> </template
            >{{ list.name }}</v-list-item
          >
        </router-link>
      </v-list>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { required } from '@vuelidate/validators'
import { useToDoListsStore } from '@/stores/toDo.store'
import useVuelidate from '@vuelidate/core'

const toDoListsStore = useToDoListsStore()
const listName = ref('')

onMounted(() => {
  toDoListsStore.getLists()
})

const rules = computed(() => {
  return {
    listName: { required }
  }
})

let v$ = useVuelidate(rules, { listName })

const createList = async () => {
  const result = await v$.value.$validate()
  if (result) {
    toDoListsStore.createList(listName.value)
  }
}
</script>

<style>
.v-list-item:hover {
  background-color: #f6f6f6;
}
a {
  text-decoration: none;
  color: black;
}
</style>
