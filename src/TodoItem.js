export class TodoItem {
    constructor(title, dueDate = "today",  priority="LOW", description="") {
        this.title = title;
        this.description = description;
        this.dueDate = new Date(dueDate);
        this.priority = priority;
    }

    toString() {
        return `${this.title} - ${this.priority} - Due ${this.dueDate}\n${this.description}`;
    }

    timeLeft() {
        let now = new Date();
        let daysLeft = Math.floor((this.dueDate - now) / (1000 * 3600 * 24));
        return daysLeft;
    }
}

