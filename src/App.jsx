import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
    const [activity, setActivity] = useState("");
    const [todos, setTodos] = useState([]);

    function addTodo(event) {
        event.preventDefault();
        setTodos([
            ...todos,
            { id: Date.now(), title: activity, completed: false },
        ]);
        setActivity("");
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
                        placeholder="What you gonna do?"
                        value={activity}
                        onChange={(event) => setActivity(event.target.value)}
                    />
                    <button type="submit">Add Task</button>
                </form>
            </div>
            <div className="card">
                <h2>Task(s) ToDo</h2>
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
