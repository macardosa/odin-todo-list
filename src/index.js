import "./styles.css";
import { TodoItem } from "./TodoItem.js";
import { sampleTodos } from "./sampleTodos.js";
import { createDisplayManager, create } from "./DisplayManager.js";
import { createTodoList } from "./TodoList.js";

const todos = createTodoList(sampleTodos);
const display = createDisplayManager(todos);

// test
display.renderTodoList("My ToDos");

const projectItem = display.createProjectField("School");
document.querySelector(".projects-list").appendChild(projectItem);