import { da } from "date-fns/locale";
import { TodoItem } from "./TodoItem.js";
import doubleArrowDownIcon from "./assets/icons/double-arrow-down.svg";

export const displayManager = (function () {
    const main = document.querySelector("main");

    const renderTodoItem = (todo) => {
        const listItem = document.createElement("div");
        listItem.classList.add("todo-item");

        // create heading 
        const headingSection = document.createElement("div");
        headingSection.classList.add("todo-heading");
        const title = document.createElement("h3");
        title.textContent = todo.title;
        title.classList.add("title");
        headingSection.appendChild(title);

        // add icon button to display details
        const icon = document.createElement("img");
        icon.src = doubleArrowDownIcon;
        icon.classList.add("todo-icon");
        headingSection.appendChild(icon);

        const dueDate = document.createElement("div");
        const daysLeft = todo.timeLeft();
        if (daysLeft < 0) {
            dueDate.textContent = "overdue";
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

        listItem.appendChild(headingSection);

        // description section
        const descriptionSection = document.createElement("p");
        descriptionSection.textContent = todo.description;
        descriptionSection.classList.add("todo-description");
        descriptionSection.style.display = "none";
        listItem.appendChild(descriptionSection);

        // allow user to see description on click
        icon.addEventListener("click", (e) => {
            if (descriptionSection.style.display === "none") {
                descriptionSection.style.display = "block";
                headingSection.classList.add("details-visible");
            } else {
                descriptionSection.style.display = "none";
                headingSection.classList.remove("details-visible");
            }
        });

        return listItem;
    }

    const renderTodoList = (TodoList) => {
        TodoList.forEach(todo => {
            let listItem = renderTodoItem(todo);
            main.appendChild(listItem);
        });
    };

    return {
        renderTodoList
    }
})();