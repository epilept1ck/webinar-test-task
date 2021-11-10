import React, {useState} from 'react';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import {TodoItemsList} from "./TodoItems";
import {TodoItem, TodoItemsActionTypes, useTodoItems} from "./TodoItemsContext";

const reorder = (list: TodoItem[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const DragDropBoard = () => {
    const { todoItems, dispatch } = useTodoItems();
    const [isDragged, setIsDragged] = useState(false)

    function onBeforeCapture() {
        setIsDragged(true)
    }
    function onDragEnd(result: any) {
        if (!result.destination) {
            return;
        }

        const items = reorder(
            todoItems,
            result.source.index,
            result.destination.index
        );

        setIsDragged(false)
        dispatch({type: TodoItemsActionTypes.SET_TODOS, data: {todoItems: items}})
    }
    return (
        <DragDropContext onDragEnd={onDragEnd} onBeforeCapture={onBeforeCapture}>
            <Droppable droppableId={"droppable"}>
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}>
                        <TodoItemsList todoItems={todoItems} isDragged={isDragged}/>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default DragDropBoard;
