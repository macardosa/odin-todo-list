import { format, compareAsc } from "date-fns";

export class TodoItem {
    constructor(title, dueDate,  priority="LOW", description="", project="My ToDos") {
        this.title = title;
        this.description = description;
        this.dueDate = new Date(dueDate);
        this.priority = priority;
        this.completed = false;
        this.id = crypto.randomUUID();
        this.project = project;
    }

    toString() {
        return `${this.title} - ${this.priority} - Due ${this.dueDate}\n${this.description}`;
    }

    timeLeft() {
        let now = new Date();
        let daysLeft = Math.floor((this.dueDate - now) / (1000 * 3600 * 24));
        return daysLeft;
    }

    complete() {
        this.complete = true;
    }

    update(data) {
        this.title = data.title;
        this.dueDate = new Date(data.dueDate);
        this.priority = data.priority;
        this.description = data.description;
    }

    dueDateString() {
        return format(this.dueDate, "yyyy-MM-dd");
    }
}

