import { atom } from 'jotai';

export interface Todo {
  id: string;
  todo: string;
}

export const todoListAtom = atom<Todo[]>([
  {
    id: 'inininin',
    todo: 'Play with Jotai',
  },
]);

export const readOnlyTodoAtom = atom(get => get(todoListAtom));

export const derivedTodoAtom = atom(
  get => get(todoListAtom),
  (get, set, action: Todo) => {
    const addedTodo = get(todoListAtom).concat(action);

    set(todoListAtom, addedTodo);
  },
);

export const removeTodoAtom = atom(null, (get, set, action: { id: string }) => {
  const filteredTodo = get(todoListAtom).filter(todo => todo.id !== action.id);
  set(todoListAtom, filteredTodo);
});
