<template>
  <ToDoApp :toDoListId="$route.params.id" :name="$route.params.name" />
</template>

<script setup lang="ts">
import ToDoApp from '../components/ToDoApp.vue'
</script>
<style></style>
