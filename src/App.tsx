import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { TodoItemsContextProvider } from './TodoItemsContext';
import TodoItemForm from './TodoItemForm';
import DragDropBoard from "./DragDropBoard";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#9012fe',
        },
        secondary: {
            main: '#b2aabf',
        },
    },
});

function App() {
    return (
        <TodoItemsContextProvider>
            <ThemeProvider theme={theme}>
                <Content />
            </ThemeProvider>
        </TodoItemsContextProvider>
    );
}

function Content() {
    return (
        <Container maxWidth="sm">
            <header>
                <Typography variant="h2" component="h1">
                    Todo List
                </Typography>
            </header>
            <main>
                <TodoItemForm />
                <DragDropBoard />
            </main>
        </Container>
    );
}

export default App;
