export interface IToDo {
  id: number
  title: string
  text: string
  isComplete: boolean
  isExpired: boolean
  deadline: string
}

export interface IToDoList {
  id: number
  name: string
}

export interface IToDoListDetailed extends IToDoList {
  todos: IToDo[]
  todo: IToDo
  filter: States
  isLoading: boolean
  searchQuery: string
}
