import { format, compareAsc } from "date-fns";

export class TodoItem {
    constructor(title, dueDate, priority, description, project) {
        this.title = title;
        this.description = (description === undefined) ? "" : description;
        this.dueDate = new Date(dueDate);
        this.priority = (priority === undefined) ? "LOW" : priority;
        this._completed = false;
        this.id = crypto.randomUUID();
        this._defaultProject = "My ToDos";
        this.userProject = (project && project !== this._defaultProject)
            ? project 
            : null;
        this.completionDate = null;
    }

    static fromJSON(obj) {
        const item = new TodoItem(
            obj.title,
            obj.dueDate,
            obj.priority,
            obj.description,
            obj.userProject
        );

        item.id = obj.id;
        item._completed = obj._completed;
        item.completionDate = obj.completionDate;

        return item;
    }

    toString() {
        return `${this.title} - ${this.priority} - Due ${this.dueDate}\n${this.description}`;
    }

    get defaultProject() {
        return this._defaultProject;
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
        return (this.userProject === null)
            ? [this._defaultProject]
            : [this._defaultProject, this.userProject];
    }

    removeProject(projectToDelete) {
        if (this.userProject === projectToDelete) {
            this.userProject = null;
        }
    }

    get project() {
        return (this.userProject)
            ? this.userProject
            : this._defaultProjectProject;
    }

    set project(projectName) {
        // ensure default always exists
        if (projectName !== this._defaultProject) {
            this.userProject = projectName;
        }
    }
}

