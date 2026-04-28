import "./styles.css";
import { TodoItem } from "./TodoItem.js";
import { sampleTodos } from "./sampleTodos.js";
import { displayManager as display } from "./DisplayManager.js";

display.renderTodoList(sampleTodos);