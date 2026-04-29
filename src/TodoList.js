import { format, compareAsc } from "date-fns";

export function createTodoList(listOfTodoItems) {
    const list = listOfTodoItems || [];

    function remove(id) {
        const index = list.findIndex((todo) => todo.id === id);
        list.splice(index, 1); // delete element
    }
    
    function completeTask(id) {
        const index = list.findIndex((todo) => todo.id === id);
        list[index].complete();
    }

    function comparePriority(a, b) {
        const order = { HIGH: 1, MEDIUM: 2, LOW: 3 };
        return order[a] - order[b];
    }

    function getList() {
        return list.filter((task) => !task.completed)
            .sort((a, b) => {
                // sorts first according to due date
                const dateDiff = compareAsc(a.dueDate, b.dueDate);
                if (dateDiff !== 0) return dateDiff;

                // for elements of equal due date sort them based on priority
                const priorityDiff = comparePriority(a.priority, b.priority)
                return priorityDiff;
            }
        );
    }

    return {
        getList,
        remove,
        completeTask
    }
}