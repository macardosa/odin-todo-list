import { da } from "date-fns/locale";
import { TodoItem } from "./TodoItem.js";
import doubleArrowDownIcon from "./assets/icons/double-arrow-down-icon.svg";
import doubleArrowUpIcon from "./assets/icons/double-arrow-up-icon.svg";
import editIcon from "./assets/icons/edit-icon.svg";
import deleteIcon from "./assets/icons/delete-icon.svg";

export const createDisplayManager = (TodoList) => {
    const main = document.querySelector("main");
    const overlay = document.querySelector(".overlay");
    const taskForm = document.querySelector(".task-form");

    const createTodoItem = (todo) => {
        const listItem = document.createElement("div");
        listItem.classList.add("todo-item");
        listItem.dataset.id = todo.id;

        // create heading 
        const headingSection = document.createElement("div");
        headingSection.classList.add("todo-heading");
        const title = document.createElement("h3");
        title.textContent = todo.title;
        title.classList.add("title");
        headingSection.appendChild(title);

        // add icon button to display details
        const seeDetailsIcon = document.createElement("img");
        seeDetailsIcon.src = doubleArrowDownIcon;
        seeDetailsIcon.classList.add("todo-icon");
        headingSection.appendChild(seeDetailsIcon);

        const dueDate = document.createElement("div");
        const daysLeft = todo.timeLeft();
        if (daysLeft < 0) {
            dueDate.textContent = "Overdue";
            title.style.textDecoration = "line-through";
        } else if (daysLeft === 0) {
            dueDate.textContent = "Due Today";
        } else if (daysLeft === 1) {
            dueDate.textContent = "Due Tomorrow";
        } else {
            dueDate.textContent = `${daysLeft} ${(daysLeft <= 1) ? "day" : "days"} left`;
        }
        dueDate.classList.add("due-date");
        headingSection.appendChild(dueDate);

        // add style according to priority
        headingSection.classList.add(`${todo.priority.toLowerCase()}-priority`);

        // add tick boxes to handle completion of todos
        const tickBox = document.createElement("div"); // used for clearing todo on completion
        tickBox.classList.add("todo-tick-box");
        // logic to remove todo items from the DOM
        tickBox.addEventListener("click", (e) => {
            // remove todo from TodoList
            TodoList.completeTask(listItem.dataset.id);
            // remove element from DOM
            tickBox.closest(".todo-item").remove();
        });
        headingSection.appendChild(tickBox);

        listItem.appendChild(headingSection);

        // details section
        const detailsSection = document.createElement("div");
        detailsSection.classList.add("todo-details");
        detailsSection.style.display = "none";

        // add description
        const description = document.createElement("div");
        description.textContent = todo.description;
        description.classList.add("todo-description");
        detailsSection.appendChild(description);

        // add cotrol buttons
        const controllers = document.createElement("div");
        controllers.classList.add("controllers");

        // button to edit task
        const editBtn = document.createElement("img");
        editBtn.src = editIcon;
        editBtn.classList.add("edit-btn", `${todo.priority.toLowerCase()}`);
        controllers.appendChild(editBtn);
        editBtn.addEventListener("click", (e) => {
            renderInputTaskForm(todo);
        });

        // button to delete task
        const deleteBtn = document.createElement("img");
        deleteBtn.src = deleteIcon;
        deleteBtn.classList.add("delete-btn", `${todo.priority.toLowerCase()}`);
        controllers.appendChild(deleteBtn);
        deleteBtn.addEventListener("click", (e) => {
            // remove todo from TodoList
            TodoList.remove(listItem.dataset.id);
            // remove element from DOM
            tickBox.closest(".todo-item").remove();
        });

        detailsSection.appendChild(controllers);
        listItem.appendChild(detailsSection);

        // allow user to see description on click
        seeDetailsIcon.addEventListener("click", (e) => {
            if (detailsSection.style.display === "none") {
                detailsSection.style.display = "flex";
                seeDetailsIcon.src = doubleArrowUpIcon;
                headingSection.classList.add("details-visible");
            } else {
                detailsSection.style.display = "none";
                seeDetailsIcon.src = doubleArrowDownIcon;
                headingSection.classList.remove("details-visible");
            }
        });

        return listItem;
    }

    const updateTodoItem = (todo) => {
        const modifiedListItem = createTodoItem(todo);
        const currentListItem = Array.from(main.querySelectorAll(".todo-item"))
            .find(item => item.dataset.id === todo.id);
        currentListItem.replaceWith(modifiedListItem);
    }

    const renderInputTaskForm = (todo) => {
        overlay.style.display = "block";
        taskForm.style.display = "grid";
        const taskFormBtn = taskForm.querySelector(".task-form-btn");
        taskFormBtn.dataset.id = todo.id;

        const title = taskForm.querySelector("[name=task-form-title]");
        title.value = todo.title;

        const dueDate = taskForm.querySelector("[name=task-form-due-date]");
        dueDate.value = todo.dueDateString();

        const priority = taskForm.querySelector("[name=task-form-priority]");
        priority.value = todo.priority;

        const description = taskForm.querySelector("[name=task-form-description]");
        description.value = todo.description;
    }

    const hideInputTaskForm = () => {
        taskForm.style.display = "none";
        overlay.style.display = "none";
    }

    const renderTodoList = () => {
        main.replaceChildren();
        TodoList.getList().forEach(todo => {
            let listItem = createTodoItem(todo);
            main.appendChild(listItem);
        });
    };

    taskForm.querySelector(".task-form-btn")
        .addEventListener("click", (e) => {
            const title = taskForm.querySelector("[name=task-form-title]").value;
            const dueDate = taskForm.querySelector("[name=task-form-due-date]").value;
            const priority = taskForm.querySelector("[name=task-form-priority]").value;
            const description = taskForm.querySelector("[name=task-form-description]").value;
            const id = e.target.dataset.id;

            const index = TodoList.updateTask(id, { title, dueDate, priority, description });
            updateTodoItem(TodoList.get(index));
            renderTodoList();
            hideInputTaskForm();
        });

    return {
        renderTodoList
    }
};