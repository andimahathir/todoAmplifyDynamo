import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Amplify, API, graphqlOperation } from "aws-amplify";
import { listTodos } from "./graphql/queries";
import { createTodo } from "./graphql/mutations";

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

function App() {
    const [activity, setActivity] = useState("");
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        fetchTodos();
    }, []);

    async function fetchTodos() {
        try {
            const todosData = await API.graphql(graphqlOperation(listTodos));
            const todosItems = todosData.data.listTodos.items;
            setTodos(todosItems);
        } catch (error) {
            console.log("error fetching todos", error);
        }
    }

    async function addTodo(event) {
        event.preventDefault();
        if (activity !== "") {
            try {
                const todo = {
                    id: Date.now(),
                    title: activity,
                    completed: false,
                };
                setTodos([...todos, todo]);
                console.log(
                    await API.graphql(
                        graphqlOperation(createTodo, { input: todo }),
                    ),
                );
            } catch (error) {}
            setActivity("");
        }
    }

    function deleteTodo(id) {
        setTodos(todos.filter((todo) => todo.id !== id));
    }

    function toggleTodo(id) {
        setTodos(
            todos.map((todo) => {
                if (todo.id === id) {
                    todo.completed = !todo.completed;
                }
                return todo;
            }),
        );
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
                <form onSubmit={addTodo}>
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
                                onChange={() => toggleTodo(todo.id)}
                            />
                            {todo.completed ? <s>{todo.title}</s> : todo.title}
                            <button onClick={() => deleteTodo(todo.id)}>
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
