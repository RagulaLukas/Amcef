import { defineStore } from 'pinia'
import axios from 'axios'
import { api } from '../api'
import { showToast, ToastTypes } from '../toast'
import moment from 'moment'
import { States } from '@/enums'
import type { IToDo, IToDoListDetailed } from '@/interfaces'

export const blankTodo: IToDo = {
  id: 0,
  title: '',
  text: '',
  isComplete: false,
  isExpired: false,
  deadline: moment(new Date()).format('YYYY-MM-DDTHH:MM')
}

export const useToDoListStore = defineStore('toDoList', {
  state: (): IToDoListDetailed => {
    return {
      id: 0,
      name: '',
      todos: [] as IToDo[],
      todo: { ...blankTodo },
      filter: States.ALL,
      isLoading: false,
      searchQuery: ''
    }
  },
  actions: {
    async getToDos() {
      this.isLoading = true
      try {
        const response = await axios.get(api + '/' + this.id + '/ToDos')
        this.todos = response.data
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
        showToast(ToastTypes.ERROR, "Can't load todos")
        throw e
      }
    },

    async createToDo() {
      try {
        const response = await axios.post(api + '/' + this.id + '/ToDos', {
          title: this.todo.title,
          text: this.todo.text,
          deadline: this.todo.deadline
        })
        this.todos.push(response.data)
        this.todo = { ...blankTodo }
        showToast(ToastTypes.SUCCESS, 'ToDo created.')
      } catch (e) {
        showToast(ToastTypes.ERROR, 'Creating ToDo failed.')
      }
    },

    // remove todo based on id
    async removeToDo(id: number) {
      try {
        await axios.delete(api + '/' + this.id + '/ToDos' + '/' + id)
        showToast(ToastTypes.SUCCESS, 'ToDo removed.')
        const todoIndex = this.todos.findIndex((todo) => todo.id === id)
        this.todos.splice(todoIndex, 1)
      } catch (e) {
        showToast(ToastTypes.ERROR, 'Removing ToDo failed.')
      }
    },

    async toggleCompleteToDoState(todo: IToDo) {
      try {
        await axios.put(api + '/' + this.id + '/ToDos' + '/' + todo.id, {
          isComplete: !todo.isComplete
        })
        todo.isComplete = !todo.isComplete
      } catch (e) {
        showToast(ToastTypes.ERROR, 'Can not set ToDo as complete.')
      }
    },

    async setExpired(id: number) {
      try {
        await axios.put(api + '/' + this.id + '/ToDos' + '/' + id, { isExpired: true })
        const todoIndex = this.todos.findIndex((todo) => todo.id === id)
        this.todos[todoIndex].isExpired = true
      } catch (e) {
        showToast(ToastTypes.ERROR, 'Can not set ToDo as expired.')
      }
    }
  },

  getters: {
    getFilteredTodos(): IToDo[] {
      let stateFilter = []
      switch (this.filter) {
        case States.DONE:
          stateFilter = this.todos.filter((todo) => todo.isComplete)
          break
        case States.ACTIVE:
          stateFilter = this.todos.filter((todo) => !todo.isComplete && !todo.isExpired)
          break
        case States.EXPIRED:
          stateFilter = this.todos.filter((todo) => todo.isExpired && !todo.isComplete)
          break
        default:
          stateFilter = this.todos
      }
      if (this.searchQuery === '') {
        return stateFilter
      }
      return stateFilter.filter((todo) => {
        if (todo.title.toLowerCase().includes(this.searchQuery.toLocaleLowerCase())) return true
        if (todo.text.toLowerCase().includes(this.searchQuery.toLocaleLowerCase())) return true
      })
    },
    countAllTasks(): number {
      return this.todos.length | 0
    },
    countAllCompleteTasks(): number {
      return this.todos.filter((todo) => todo.isComplete).length | 0
    },
    percentageProgress(): number {
      return ((this.countAllCompleteTasks / this.countAllTasks) * 100) | 0
    }
  }
})
