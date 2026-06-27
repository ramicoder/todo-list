import Task from "./task.js";
export default class Project {
    constructor(title, tasks = []) {
        this.title = title;
        this.tasks = tasks;
        this.id = crypto.randomUUID();
    }

    addTask(task) {
        this.tasks.push(task);
    }

    deleteTask(targetId) {

        this.tasks = this.tasks.filter
            (task => task.id !== targetId);
    }

    editTask(targetId, updatedProperties) {
        
        const task = this.tasks.find(t => t.id === targetId); 
        if (task) {            
            Object.assign(task, updatedProperties);
        }
    }
}

export const projectLoader = () => {

    const content = document.getElementById("content");
    content.innerHTML = ``
}