export type ShowCommand = {
  method: 'show'
  list: string
}

export type AddCommand = {
  method: 'add'
  body: string
  list: string
}

export type RemoveCommand = {
  method: 'remove'
  index: number
  list: string
}

export type ClearCommand = {
  method: 'clear'
  list: string
}

export type HelpCommand = {
  method: 'help'
  output: string
}

export type Command =
  | ShowCommand
  | AddCommand
  | RemoveCommand
  | ClearCommand
  | HelpCommand

export type ListItem = {
  id: string
  body: string
  category: string
  createdAt: string
  updatedAt: string
}
