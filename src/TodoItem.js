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
        this._projects = (project === undefined || project === this._defaultProject) ? [this._defaultProject] : [this._defaultProject, project];
        this.completionDate = null;
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
        return this._projects;
    }

    removeProject(projectToDelete) {
        if (this.defaultProject.toLowerCase() === projectToDelete.toLowerCase()) {
            // not allowed to delete default project
            return;
        }
        this._projects = this._projects.filter(project => project !== projectToDelete);
    }

    get project() {
        return this.projects.length
            ? this.projects.at(-1)
            : "My ToDos";
    }

    set project(projectName) {
        // ensure default always exists
        if (this._projects.length === 0) {
            this._projects.push(this._defaultProject);
        }

        if (this._projects.length > 1) {
            this._projects[1] = projectName;
        } else {
            this._projects.push(projectName);
        }
    }
}

