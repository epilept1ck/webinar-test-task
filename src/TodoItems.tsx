import {useCallback} from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DeleteIcon from '@material-ui/icons/Delete';
import {makeStyles} from '@material-ui/core/styles';
import classnames from 'classnames';
import {motion} from 'framer-motion';
import {TodoItem, TodoItemsActionTypes, useTodoItems} from './TodoItemsContext';
import {Draggable} from "react-beautiful-dnd";

const spring = {
    type: 'spring',
    damping: 25,
    stiffness: 120,
    duration: 0.25,
};

const useTodoItemListStyles = makeStyles({
    root: {
        listStyle: 'none',
        padding: 0,
    },
    todoItemRoot: {
        marginTop: 24,
    },
});

export const TodoItemsList = function ({todoItems, isDragged}: {todoItems: TodoItem[], isDragged: boolean}) {
    const classes = useTodoItemListStyles();

    const sortedItems = todoItems.slice().sort((a, b) => {
        if (a.done && !b.done) {
            return 1;
        }

        if (!a.done && b.done) {
            return -1;
        }

        return 0;
    });

    return (
        <ul className={classes.root}>
            {sortedItems.map((item, index) => (
                <motion.li key={item.id} transition={spring} layout={!isDragged}>
                    <Draggable draggableId={item.id} index={index}>
                        {(provided => (
                            <div className={classes.todoItemRoot} ref={provided.innerRef}
                                 {...provided.draggableProps}
                                 {...provided.dragHandleProps}>
                                <TodoItemCard item={item}/>
                            </div>
                        ))}
                    </Draggable>
                </motion.li>
            ))}
        </ul>
    );
};

const useTodoItemCardStyles = makeStyles({
    doneRoot: {
        textDecoration: 'line-through',
        color: '#888888',
    },
});

export const TodoItemCard = function ({ item }: { item: TodoItem}) {
    const classes = useTodoItemCardStyles();
    const { dispatch } = useTodoItems();

    const handleDelete = useCallback(
        () => dispatch({ type: TodoItemsActionTypes.DELETE, data: { id: item.id } }),
        [item.id, dispatch],
    );

    const handleToggleDone = useCallback(
        () =>
            dispatch({
                type: TodoItemsActionTypes.TOGGLE_DONE,
                data: { id: item.id },
            }),
        [item.id, dispatch],
    );

    return (
        <Card
            className={classnames({
                [classes.doneRoot]: item.done,
            })}
        >
            <CardHeader
                action={
                    <IconButton aria-label="delete" onClick={handleDelete}>
                        <DeleteIcon />
                    </IconButton>
                }
                title={
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={item.done}
                                onChange={handleToggleDone}
                                name={`checked-${item.id}`}
                                color="primary"
                            />
                        }
                        label={item.title}
                    />
                }
            />
            {item.details ? (
                <CardContent>
                    <Typography variant="body2" component="p">
                        {item.details}
                    </Typography>
                </CardContent>
            ) : null}
        </Card>
    );
};
