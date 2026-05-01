import { da } from "date-fns/locale";
import { TodoItem } from "./TodoItem.js";
import doubleArrowDownIcon from "./assets/icons/double-arrow-down-icon.svg";
import doubleArrowUpIcon from "./assets/icons/double-arrow-up-icon.svg";
import editIcon from "./assets/icons/edit-icon.svg";
import deleteIcon from "./assets/icons/delete-icon.svg";

export const createDisplayManager = (TodoList) => {
    const todoListElement = document.querySelector(".todo-list");
    const overlay = document.querySelector(".overlay");
    const taskForm = document.querySelector(".task-form");
    const projectsListElement = document.querySelector(".projects-list");
    let activeProject = "My ToDos";

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
            listItem.classList.add("overdue");
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
        editBtn.dataset.id = todo.id;
        controllers.appendChild(editBtn);

        // button to delete task
        const deleteBtn = document.createElement("img");
        deleteBtn.src = deleteIcon;
        deleteBtn.classList.add("delete-btn", `${todo.priority.toLowerCase()}`);
        controllers.appendChild(deleteBtn);

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
        const currentListItem = Array.from(todoListElement.querySelectorAll(".todo-item"))
            .find(item => item.dataset.id === todo.id);
        currentListItem.replaceWith(modifiedListItem);
    }

    const renderInputTaskForm = () => {
        overlay.style.display = "block";
        taskForm.style.display = "grid";
    }

    const updateInputTaskForm = (taskId) => {
        const taskFormBtn = taskForm.querySelector(".task-form-btn");
        taskFormBtn.classList.add("update-task");
        taskFormBtn.textContent = "Update";
        taskFormBtn.dataset.id = taskId;

        const todo = TodoList.findTaskById(taskId);

        const title = taskForm.querySelector("[name=task-form-title]");
        title.value = todo.title;

        const dueDate = taskForm.querySelector("[name=task-form-due-date]");
        dueDate.value = todo.dueDateString();

        const priority = taskForm.querySelector("[name=task-form-priority]");
        priority.value = todo.priority;

        const description = taskForm.querySelector("[name=task-form-description]");
        description.value = todo.description;
    }

    const clearInputTaskForm = () => {
        taskForm.style.display = "none";
        overlay.style.display = "none";
        taskForm.querySelector("[name='task-form-title']").value = "";
        taskForm.querySelector("[name='task-form-due-date']").value = "";
        taskForm.querySelector("[name='task-form-priority']").value = "LOW";
        taskForm.querySelector("[name='task-form-description']").value = "";
    }

    const renderTodoList = (project) => {
        const heading = document.querySelector(".main-heading");
        heading.textContent = project;
        todoListElement.replaceChildren();

        if (project === "Completed") {
            const listOfTodoItems = TodoList.getCompletedList();
            document.querySelector(".add-todo-btn").style.display = "none";
            listOfTodoItems.forEach(todo => {
                let listItem = createTodoItem(todo);
                listItem.querySelector(".todo-tick-box").style.display = "none";
                listItem.classList.remove("overdue"); // in case exists
                listItem.classList.add("completed");
                listItem.querySelector(".due-date").textContent = `${todo.completionDateString()}`;
                todoListElement.appendChild(listItem);
            });
        } else {
            const listOfTodoItems = TodoList.getList(project);
            document.querySelector(".add-todo-btn").style.display = "block";
            activeProject = project;
            listOfTodoItems.forEach(todo => {
                let listItem = createTodoItem(todo);
                todoListElement.appendChild(listItem);
            });
        }

        updateProjectCounts();
    };

    taskForm.querySelector(".task-form-btn")
        .addEventListener("click", (e) => {
            e.preventDefault(); // prevent submitting the form

            const title = taskForm.querySelector("[name=task-form-title]").value;
            const dueDate = taskForm.querySelector("[name=task-form-due-date]").value;
            const priority = taskForm.querySelector("[name=task-form-priority]").value;
            const description = taskForm.querySelector("[name=task-form-description]").value;

            if (!title || !dueDate) {
                taskForm.reportValidity?.();
                return;
            }

            if (e.target.classList.contains("update-task")) {
                const id = e.target.dataset.id;
                const index = TodoList.updateTask(id, { title, dueDate, priority, description });
                updateTodoItem(TodoList.get(index));
                e.target.classList.remove("update-task");
            } else {
                TodoList.addTask(new TodoItem(title, dueDate, priority, description, activeProject));
            }

            renderTodoList(activeProject);
            clearInputTaskForm();
        });

    function createProjectField(projectNameText) {
        const projectItem = document.createElement("div");
        projectItem.classList.add("project-item");
        projectItem.dataset.project = projectNameText;

        const projectName = document.createElement("div");
        projectName.textContent = projectNameText;
        projectName.classList.add("project-name");

        const projectCount = document.createElement("div");
        projectCount.classList.add("project-count");
        projectCount.textContent = "0";

        projectItem.appendChild(projectName);
        projectItem.appendChild(projectCount);

        return projectItem;
    }

    projectsListElement.addEventListener("click", (e) => {
        if (e.target.classList.contains("project-name")) {
            const projectName = e.target.textContent;
            renderTodoList(projectName);
            return;
        }
        if (e.target.classList.contains("new-project-btn")) {
            const input = projectsListElement.querySelector(".new-project-input");
            const projectName = input.value;
            if (projectName !== "") {
                // remove the input and button fields to add new project
                projectsListElement.lastElementChild.remove();
                projectsListElement.lastElementChild.remove();

                // append the new project item
                const projectItem = createProjectField(projectName);
                projectsListElement.appendChild(projectItem);
            }
            return;
        }
    });

    function updateProjectCounts() {
        const projects = TodoList.getListOfProjects();
        Object.entries(projects).forEach(([projectName, projectCount]) => {
            const projectCountElement = projectsListElement.querySelector(`[data-project="${projectName}"] .project-count`);
            projectCountElement.textContent = projectCount;
        });
        console.log(projects);
    }

    // logic to remove todo items when task is marked as completed
    todoListElement.addEventListener("click", (e) => {
        if (e.target.classList.contains("todo-tick-box")) {
            const listItem = e.target.closest(".todo-item");
            // flag task as completed
            TodoList.completeTask(listItem.dataset.id);
            // remove element from DOM
            listItem.remove();
            // update project counts
            updateProjectCounts();
        } else if (e.target.classList.contains("delete-btn")) {
            const listItem = e.target.closest(".todo-item");
            // remove todo from TodoList
            TodoList.removeTask(listItem.dataset.id);
            // remove element from DOM
            listItem.remove();
            // update project counts
            updateProjectCounts();
        } else if (e.target.classList.contains("edit-btn")) {
            renderInputTaskForm();
            updateInputTaskForm(e.target.dataset.id);
        }
    });

    // button to add new projects
    document.querySelector(".add-project-btn")
        .addEventListener("click", (e) => {
            // create input to take project name
            const input = document.createElement("input");
            input.classList.add("new-project-input");
            const btn = document.createElement("button");
            btn.classList.add("new-project-btn");
            btn.textContent = "Add Project";
            projectsListElement.appendChild(input);
            projectsListElement.appendChild(btn);

        });

    // button to add new todo
    document.querySelector(".add-todo-btn")
        .addEventListener("click", () => {
            renderInputTaskForm();
        });

    return {
        renderTodoList
    }
};