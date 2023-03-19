<template>
  <v-form @submit.prevent="createToDo" class="p-3">
    <v-text-field
      clearable
      label="Title"
      variant="solo"
      v-model="formData.title"
      :hide-details="true"
    ></v-text-field>
    <small class="p-2 text-red" v-for="error in v$.title.$errors" :key="error.$uid">
      {{ error.$message }}</small
    >

    <v-textarea
      clearable
      label="Text"
      variant="solo"
      class="mt-3"
      v-model="formData.text"
      :hide-details="true"
    ></v-textarea>

    <small class="p-2 text-red" v-for="error in v$.text.$errors" :key="error.$uid">
      {{ error.$message }}</small
    >
    <v-text-field
      type="datetime-local"
      label="Deadline"
      variant="solo"
      class="mt-3"
      v-model="formData.deadline"
      :hide-details="true"
    ></v-text-field>
    <small class="p-2 text-red" v-for="error in v$.deadline.$errors" :key="error.$uid">
      {{ error.$message }}</small
    >

    <v-btn type="submit" block class="mt-3">Submit</v-btn>
  </v-form>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { reactive, computed } from 'vue'
import { useToDoListStore } from '../stores/toDoList.store'
import moment from 'moment'

const emits = defineEmits(['closeForm'])

const toDoListStore = useToDoListStore()
let formData = reactive({
  title: '',
  text: '',
  deadline: moment().format('YYYY-MM-DD HH:mm')
})

const minDeadline = (value: Date) => {
  return moment(value) > moment()
}

const rules = computed(() => {
  return {
    title: { required },
    text: { required },
    deadline: {
      required,
      minDeadline: helpers.withMessage('Deadline must be set in the future.', minDeadline)
    }
  }
})

let v$ = useVuelidate(rules, formData)

const createToDo = async () => {
  const result = await v$.value.$validate()
  if (result) {
    // usually i like to create blank item that i fill with info so i dont need to send it,
    // here it is not possible because vuelidate dont know that in store i changed (cleared) my object
    // can do validation inside this method but then errors will not be reactive
    // so i used  hybrid approach
    toDoListStore.todo.text = formData.text
    toDoListStore.todo.title = formData.title
    toDoListStore.todo.deadline = formData.deadline
    toDoListStore.createToDo()

    formData.text = ''
    formData.title = ''
    formData.deadline = moment().format('YYYY-MM-DD HH:mm')
    emits('closeForm')
    // need to reset v$ dirty state, otherwise it will validate empty form and got errors
    v$.value.$reset()
  }
}
</script>
