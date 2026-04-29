import "./styles.css";
import { TodoItem } from "./TodoItem.js";
import { sampleTodos } from "./sampleTodos.js";
import { createDisplayManager } from "./DisplayManager.js";
import { createTodoList } from "./TodoList.js";

const todos = createTodoList(sampleTodos);
const display = createDisplayManager(todos);

display.renderTodoList();