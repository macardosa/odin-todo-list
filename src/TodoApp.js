import { TodoItem } from "./TodoItem.js";
import { createTodoList } from "./TodoList.js";
import { createDisplayManager } from "./DisplayManager.js";

export class TodoApp {
    constructor(todoItemsArray) {
        this.todoList = (todoItemsArray)
            ? createTodoList(todoItemsArray)
            : createTodoList();
        this.projects = ["My ToDos"];
        this.activeProject = "My ToDos";
        this.DOM = createDisplayManager(this.todoList, this.projects, this.activeProject);
    }

    run() {
        // test
        this.DOM.renderTodoList(this.activeProject);

        this.projects.push("Work");
        const projectItem1 =  this.DOM.createProjectField("Work");
        document.querySelector(".projects-list").appendChild(projectItem1);

        this.projects.push("Home");
        const projectItem2 =  this.DOM.createProjectField("Home");
        document.querySelector(".projects-list").appendChild(projectItem2);
    }
}