import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Amplify, API, graphqlOperation } from "aws-amplify";
import { listTodos } from "./graphql/queries";
import { createTodo, deleteTodo, updateTodo } from "./graphql/mutations";

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

function App() {
    const [activity, setActivity] = useState("");
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        FetchTodos();
    }, []);

    async function FetchTodos() {
        try {
            const todosData = await API.graphql(graphqlOperation(listTodos));
            const todosItems = todosData.data.listTodos.items;
            setTodos(todosItems);
        } catch (error) {
            console.log("error fetching todos", error);
        }
    }

    async function AddTodo(event) {
        event.preventDefault();
        if (activity !== "") {
            try {
                const todo = {
                    id: Date.now(),
                    title: activity,
                    completed: false,
                };
                const newTodo = await API.graphql(
                    graphqlOperation(createTodo, { input: todo }),
                );
                setTodos([...todos, newTodo.data.createTodo]);
            } catch (error) {
                console.log("error creating todo:", error);
            }
            setActivity("");
        }
    }

    async function DestroyTodo(id) {
        const destroyTodo = todos.filter((todo) => todo.id === id);
        if (destroyTodo.length === 1) {
            const targetDestroy = {
                id: destroyTodo[0].id,
            };
            try {
                const destroyedTodo = await API.graphql(
                    graphqlOperation(deleteTodo, { input: targetDestroy }),
                );
                setTodos(
                    todos.filter(
                        (todo) => todo.id !== destroyedTodo.data.deleteTodo.id,
                    ),
                );
            } catch (error) {
                console.log("error deleting todo:", error);
            }
        }
    }

    async function ToggleTodo(id) {
        const toggleTodo = todos.filter((todo) => todo.id === id);
        if (toggleTodo.length === 1) {
            const targetToggle = {
                id: toggleTodo[0].id,
                completed: !toggleTodo[0].completed,
            };
            try {
                const toggledTodo = await API.graphql(
                    graphqlOperation(updateTodo, { input: targetToggle }),
                );
                setTodos(
                    todos.map((todo) => {
                        if (todo.id === toggledTodo.data.updateTodo.id) {
                            todo.completed =
                                toggledTodo.data.updateTodo.completed;
                        }
                        return todo;
                    }),
                );
            } catch (error) {
                console.log("error updating todo:", error);
            }
        }
    }

    return (
        <div className="App">
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://reactjs.org" target="_blank">
                    <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1>ToDo What ToDo</h1>
            <div className="card">
                <form onSubmit={AddTodo}>
                    <input
                        type="text"
                        placeholder="Whatchu gonna do?"
                        value={activity}
                        onChange={(event) => setActivity(event.target.value)}
                    />
                    <button type="submit">Add Task</button>
                </form>
            </div>
            <div className="card">
                {todos.length === 0 && <h2>No Task ToDo</h2>}
                {todos.length === 1 && <h2>A Task ToDo</h2>}
                {todos.length > 1 && <h2>{todos.length} Tasks ToDo</h2>}
                <ul className="no-bullets">
                    {todos.map((todo) => (
                        <li key={todo.id}>
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => ToggleTodo(todo.id)}
                            />
                            {todo.completed ? <s>{todo.title}</s> : todo.title}
                            <button onClick={() => DestroyTodo(todo.id)}>
                                x
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
