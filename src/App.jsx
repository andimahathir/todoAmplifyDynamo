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
                    {todos.map((todo, index) => (
                        <li key={index}>{todo.title}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
