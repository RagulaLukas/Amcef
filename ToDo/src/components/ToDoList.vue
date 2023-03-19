<template>
  <v-list-item class="align-content-center">
    <template v-slot:prepend="{}">
      <v-list-item-action start>
        <v-checkbox-btn
          :model-value="todo.isComplete"
          :disabled="todo.isExpired"
          @click="toDoListStore.toggleCompleteToDoState(todo)"
        ></v-checkbox-btn>
      </v-list-item-action>
    </template>

    <template v-slot:append="{}">
      <v-list-item-action end>
        <v-btn
          flat
          color="red"
          variant="outlined"
          size="x-small"
          :model-value="todo.isComplete"
          icon="mdi-trash-can"
          @click.stop="toDoListStore.removeToDo(todo.id)"
        ></v-btn>
      </v-list-item-action>
    </template>

    <v-list-item-title :class="{ 'text-green': todo.isComplete }">{{
      todo.title
    }}</v-list-item-title>

    <v-list-item-subtitle>
      {{ todo.text }}
    </v-list-item-subtitle>
    <v-list-item-subtitle v-if="!todo.isComplete">
      <strong
        ><small class="pt-2" :class="{ 'text-red': todo.isExpired }">{{
          todo.isExpired ? 'Expired' : checkDeadline(todo.deadline, todo.id)
        }}</small></strong
      >
    </v-list-item-subtitle>
  </v-list-item>
</template>

<script setup lang="ts">
import type { IToDo } from '@/interfaces'
import { useToDoListStore } from '../stores/toDoList.store'
import moment from 'moment'

const toDoListStore = useToDoListStore()
// checks if todo expired if not, calculate time to expiration
const checkDeadline = (deadline: string, id: number) => {
  if (moment(deadline) > moment()) {
    return 'Expiration ' + moment(deadline).fromNow()
  } else {
    toDoListStore.setExpired(id)
  }
}

const props = defineProps<{
  todo: IToDo
}>()
</script>
