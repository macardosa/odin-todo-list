import { TodoItem } from "./TodoItem.js";
import { createTodoList } from "./TodoList.js";
import { createDisplayManager } from "./DisplayManager.js";

export class TodoApp {
    constructor() {
        this.todoList = createTodoList();
        this.userProjects = [];
        this.activeProject = "My ToDos"; // default
        this.DOM = createDisplayManager(this.todoList, this.userProjects, {
            get: ( ) => this.activeProject,
            set: (v) => this.activeProject = v
        });

        // listen to notifications sent when the todolist or projects are changed
        document.addEventListener("todoChange", () => {
            this.save();
        })
    }

    save() {
        localStorage.setItem("todoList", JSON.stringify(this.todoList.getList()));
        localStorage.setItem("userProjects", JSON.stringify(this.userProjects));
        localStorage.setItem("activeProject", this.activeProject);
    }

    load() {
        const itemsArray = JSON.parse(localStorage.getItem("todoList") || "[]");
        const userProjects = JSON.parse(localStorage.getItem("userProjects") || "[]");
        const activeProject = localStorage.getItem("activeProject") || "My ToDos";

        itemsArray.forEach(obj => {
            this.todoList.addTask(TodoItem.fromJSON(obj));
        });
        userProjects.forEach(project => this.userProjects.push(project));
        this.activeProject = activeProject;
    }

    run() {
        this.DOM.renderProjectsList();
        this.DOM.renderTodoList(this.activeProject);
    }

    loadSample(sampleTodosArray) {
        sampleTodosArray.forEach(
            (todo) => this.todoList.addTask(todo)
        );
    }

    clear() {
        localStorage.removeItem("todoList");
        localStorage.removeItem("projects");
        localStorage.removeItem("activeProject");
    }
}