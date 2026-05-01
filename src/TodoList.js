import { format, compareAsc } from "date-fns";

export function createTodoList(listOfTodoItems) {
    const list = listOfTodoItems || [];

    function get(index) {
        if (index >= list.length || index < 0) {
            throw Error("Invalid index accessing TodoList.get()");
        }
        return list[index];
    }

    function addTask(todo) {
        list.push(todo);
    }

    function findTaskById(id) {
        return list.find(task => String(task.id) === String(id));
    }

    function removeTask(id) {
        const index = list.findIndex((todo) => todo.id === id);
        list.splice(index, 1); // delete element
    }

    function completeTask(id) {
        const index = list.findIndex((todo) => todo.id === id);
        list[index].complete();
    }

    function updateTask(id, data) {
        const index = list.findIndex((todo) => todo.id === id);
        list[index].update(data);
        return index;
    }

    function comparePriority(a, b) {
        const order = { HIGH: 1, MEDIUM: 2, LOW: 3 };
        return order[a] - order[b];
    }

    function getList(project) {
        return list.filter((task) => !task.completed && task.projects.includes(project))
            .sort((a, b) => {
                // sorts first according to due date
                const dateDiff = compareAsc(a.dueDate, b.dueDate);
                if (dateDiff !== 0) return dateDiff;

                // for elements of equal due date: sort them based on priority
                const priorityDiff = comparePriority(a.priority, b.priority)
                return priorityDiff;
            }
            );
    }

    function getCompletedList() {
        return list.filter((task) => task.completed)
            .sort((a, b) => {
                // sorts first according to due date
                const dateDiff = compareAsc(a.dueDate, b.dueDate);
                if (dateDiff !== 0) return dateDiff;

                // for elements of equal due date: sort them based on priority
                const priorityDiff = comparePriority(a.priority, b.priority)
                return priorityDiff;
            }
            );
    }

    function getListOfProjects() {
        return list.reduce((projects, todoItem) => {
            todoItem.projects.forEach(project => {
                if (!projects[project]) {
                    projects[project] = 0;
                }

                if (!todoItem.completed) {
                    projects[project]++;
                } else {
                    projects.Completed++;
                }
            });

            return projects;
        }, { "Completed": 0 });
    }

    return {
        getList,
        getListOfProjects,
        removeTask,
        completeTask,
        updateTask,
        get,
        addTask,
        findTaskById,
        getCompletedList
    }
}