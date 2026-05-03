import "./styles.css";
import { sampleTodos } from "./sampleTodos.js";
import { TodoApp } from "./TodoApp.js"

// const app = new TodoApp(sampleTodos);
const app = new TodoApp();
app.load();
// app.loadSample(sampleTodos);
app.run();