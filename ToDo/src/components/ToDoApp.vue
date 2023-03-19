<template>
  <v-card class="mx-auto" width="500">
    <v-toolbar color="blue">
      <v-toolbar-title>{{ toDoListStore.name }}</v-toolbar-title>

      <v-text-field class="pr-3" variant="underlined" v-model="toDoListStore.searchQuery">
        <template v-slot:append-inner>
          <v-icon x-large>mdi-magnify</v-icon>
        </template></v-text-field
      >
      <v-btn icon="mdi-plus" @click="toggleForm = !toggleForm"></v-btn>
    </v-toolbar>
    <v-expand-transition>
      <to-do-form v-if="toggleForm" @close-form="toggleForm = false"></to-do-form>
    </v-expand-transition>

    <v-row justify="space-around" class="align-center py-1 w-100 mt-3 m-0">
      <v-btn
        v-for="state in States"
        :key="state"
        :class="{ 'active-filter': toDoListStore.filter === state }"
        size="small"
        flat
        @click="toDoListStore.filter = state"
        >{{ state }}</v-btn
      >
      <v-progress-circular
        :rotate="360"
        :size="35"
        :width="5"
        :model-value="toDoListStore.percentageProgress"
        color="#2196F3"
      >
        {{ toDoListStore.percentageProgress }}%
      </v-progress-circular>
    </v-row>
    <v-divider></v-divider>

    <div class="text-center pb-3" v-if="toDoListStore.isLoading">
      <v-progress-circular indeterminate color="blue"></v-progress-circular>
    </div>
    <v-list :lines="false" class="pt-0 pb-3" v-else>
      <p class="text-center" v-if="toDoListStore.getFilteredTodos.length === 0">No tasks.</p>
      <to-do-list
        v-else
        v-for="todo in toDoListStore.getFilteredTodos"
        :key="todo.id"
        :todo="todo"
      ></to-do-list>
    </v-list>
    <v-btn href="/" block class="mt-3">Go Back</v-btn>
  </v-card>
</template>

<script setup lang="ts">
import ToDoForm from './ToDoForm.vue'
import ToDoList from './ToDoList.vue'

import { onMounted, ref } from 'vue'
import { useToDoListStore } from '../stores/toDoList.store'
import { States } from '@/enums'

const toDoListStore = useToDoListStore()
const toggleForm = ref(false)
const props = defineProps(['toDoListId', 'name'])

onMounted(() => {
  toDoListStore.id = props.toDoListId
  toDoListStore.name = props.name
  toDoListStore.getToDos()
})
</script>

<style>
.align-content-center {
  align-content: center;
}

.active-filter {
  border-bottom: 1px solid #2196f3;
}

.v-progress-circular__content {
  font-size: 8px !important;
}
.p-0 {
  padding: 0;
}
</style>
