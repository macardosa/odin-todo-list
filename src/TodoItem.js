import { format, compareAsc } from "date-fns";

export class TodoItem {
    constructor(title, dueDate, priority, description, project) {
        this.title = title;
        this.description = (description === undefined) ? "" : description;
        this.dueDate = new Date(dueDate);
        this.priority = (priority === undefined) ? "LOW" : priority;
        this._completed = false;
        this.id = crypto.randomUUID();
        this._projects = (project === undefined || project === "My ToDos") ? ["My ToDos"] : ["My ToDos", project];
        this.completionDate = null;
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
        this._completed = true;
        this.completionDate = new Date();
    }

    get completed() {
        return this._completed;
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

    completionDateString() {
        return format(this.completionDate, "yyyy-MM-dd HH:mm");
    }

    get projects() {
        return this._projects;
    }

    get project() {
        return this.projects.length
            ? this.projects.at(-1)
            : "My ToDos";
    }
}

