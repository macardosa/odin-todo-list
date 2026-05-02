import { format, compareAsc } from "date-fns";

export function createTodoList(listOfTodoItems) {
    const list = listOfTodoItems || []; 

    function getTask(index) {
        if (index >= list.length || index < 0) {
            throw Error("Invalid index accessing TodoList.getTask()");
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

    function setProject(id, project) {
        const index = list.findIndex((todo) => todo.id === id);
        list[index].project = project;
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

    function getList() {
        return list;
    }

    function getListForProject(project) {
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

    function countProjects(projectsList) {
        return list.reduce((projectCounts, todoItem) => {
            if (todoItem.completed) {
                projectCounts.Completed++;
            }

            todoItem.projects.forEach(project => {
                if (!projectCounts[project]) {
                    projectCounts[project] = 0;
                }

                if (!todoItem.completed) {
                    projectCounts[project]++;
                }     
            });

            return projectCounts;
        }, { "Completed": 0 });
    }

    function removeProject(projectToDelete) {
        list.forEach(item => item.removeProject(projectToDelete));
    }

    return {
        getList,
        getListForProject,
        countProjects,
        removeTask,
        completeTask,
        updateTask,
        getTask,
        addTask,
        findTaskById,
        getCompletedList,
        removeProject,
        setProject
    }
}