import { defineStore } from 'pinia'
import axios from 'axios'
import { api } from '../api'
import type { IToDoList } from '@/interfaces'
import { showToast, ToastTypes } from '../toast'

export const useToDoListsStore = defineStore('toDoLists', {
  state: () => {
    return {
      listName: '',
      toDoLists: [] as IToDoList[],
      isLoading: false
    }
  },

  actions: {
    async getLists() {
      this.isLoading = true
      try {
        const response = await axios.get(api)
        this.toDoLists = response.data
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
        showToast(ToastTypes.ERROR, "Can't load Lists")
        throw e
      }
    },

    async createList(listName: string) {
      try {
        const response = await axios.post(api, {
          name: listName
        })
        this.toDoLists.push(response.data)
        this.listName = ''
        showToast(ToastTypes.SUCCESS, 'List created.')
      } catch (e) {
        showToast(ToastTypes.ERROR, 'Creating ToDo failed.')
      }
    }
  }
})
