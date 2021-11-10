import React, {
    createContext,
    ReactNode, useCallback,
    useContext,
    useEffect,
    useReducer,
} from 'react';

export interface TodoItem {
    id: string;
    title: string;
    details?: string;
    done: boolean;
}

export enum TodoItemsActionTypes {
    LOAD_STATE = 'loadState',
    SET_TODOS = 'setTodos',
    ADD = 'add',
    DELETE = 'delete',
    TOGGLE_DONE = 'toggleDone',
}

interface TodoItemsState {
    todoItems: TodoItem[];
}

interface AddedTodoItem {
    title: string;
    details?: string;
}


interface TodoItemsLoadStateAndSetTodosAction {
    type: TodoItemsActionTypes.LOAD_STATE | TodoItemsActionTypes.SET_TODOS,
    data: TodoItemsState
}

interface TodoItemsAddAction {
    type: TodoItemsActionTypes.ADD,
    data: {todoItem: AddedTodoItem}
}

interface TodoItemsDeleteAndToggleDoneAction {
    type: TodoItemsActionTypes.DELETE | TodoItemsActionTypes.TOGGLE_DONE,
    data: {id: string}
}

type TodoItemsAction = TodoItemsLoadStateAndSetTodosAction | TodoItemsAddAction | TodoItemsDeleteAndToggleDoneAction

const TodoItemsContext = createContext<
    (TodoItemsState & { dispatch: (action: TodoItemsAction) => void }) | null
>(null);

const defaultState: TodoItemsState = { todoItems: [] };
const localStorageKey = 'todoListState';

export const TodoItemsContextProvider = ({
    children,
}: {
    children?: ReactNode;
}) => {
    const [state, dispatch] = useReducer(todoItemsReducer, defaultState);
    const storageListener = useCallback(() => {
        loadState(dispatch)
    }, [])

    useEffect(() => {
        loadState(dispatch)
        window.addEventListener('storage', storageListener);
    }, []);

    useEffect(() => {
        // Синхронизация данных в нескольких вкладках + предупреждение о заполненности хранилища
        window.removeEventListener('storage', storageListener);
        try {
            localStorage.setItem(localStorageKey, JSON.stringify(state));
        }
        catch (e) {
            alert("Local Storage is full, please empty data")
        }
        window.addEventListener('storage', storageListener);
    }, [state]);

    return (
        <TodoItemsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </TodoItemsContext.Provider>
    );
};

const loadState = (dispatch: React.Dispatch<TodoItemsAction>) => {
    const savedState = localStorage.getItem(localStorageKey);
    if (savedState) {
        try {
            dispatch({ type: TodoItemsActionTypes.LOAD_STATE, data: JSON.parse(savedState) });
        } catch {}
    }
}

export const useTodoItems = () => {
    const todoItemsContext = useContext(TodoItemsContext);

    if (!todoItemsContext) {
        throw new Error(
            'useTodoItems hook should only be used inside TodoItemsContextProvider',
        );
    }

    return todoItemsContext;
};

function todoItemsReducer(state: TodoItemsState, action: TodoItemsAction): TodoItemsState {
    switch (action.type) {
        case TodoItemsActionTypes.LOAD_STATE: {
            return action.data;
        }
        case TodoItemsActionTypes.SET_TODOS: {
            return {
                ...state,
                todoItems: action.data.todoItems
            }
        }
        case TodoItemsActionTypes.ADD:
            return {
                ...state,
                todoItems: [
                    { id: generateId(), done: false, ...action.data.todoItem },
                    ...state.todoItems,
                ],
            };
        case TodoItemsActionTypes.DELETE:
            return {
                ...state,
                todoItems: state.todoItems.filter(
                    ({ id }) => id !== action.data.id,
                ),
            };
        case TodoItemsActionTypes.TOGGLE_DONE:
            const itemIndex = state.todoItems.findIndex(
                ({ id }) => id === action.data.id,
            );
            const item = state.todoItems[itemIndex];

            return {
                ...state,
                todoItems: [
                    ...state.todoItems.slice(0, itemIndex),
                    { ...item, done: !item.done },
                    ...state.todoItems.slice(itemIndex + 1),
                ],
            };
        default:
            throw new Error();
    }
}

function generateId() {
    return `${Date.now().toString(36)}-${Math.floor(
        Math.random() * 1e16,
    ).toString(36)}`;
}
