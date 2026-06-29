import Task from "./task.js";
import sanitizeHTML from "./sanitize.js";
import { state, createTaskModal } from "./index.js";
import { taskLoader } from "./task.js";

export class Project {
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

    getTask(targetId) {
        return this.tasks.find(task => task.id === targetId);
    }

    editTask(targetId, newDetails) {
        const task = this.getTask(targetId);
        if (task) task.updateTask(newDetails);
    }

    toggleTask(targetId) {
        const task = this.getTask(targetId);
        if (task) task.checked = !task.checked;
    }

    updateTask(newDetails) {
    this.title = newDetails.title;
    this.descript = newDetails.descript;
    this.priority = newDetails.priority;
    this.notes = newDetails.notes;
    this.date = format(new Date(newDetails.date), 'yyyy-MM-dd');
    }
}

export const projectLoader = (projects) => {
    const projectGrp = document.getElementById("projects");
    projectGrp.innerHTML = `<p style="text-align: left; font-weight: bold; margin: 10px 10px 20px 13px; font-size: 22px;">Pick a Project</p>
    <ul id="project-list"></ul>`;
    const list = document.getElementById("project-list");
    list.innerHTML = "";
    const htmlString = projects.map(project => `
        <li data-id="${project.id}" class="project-item">
            <p class="project-title">
                ${sanitizeHTML(project.title)}
            </p>
            <span class="svg-duo">
                <svg class="edit-project" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>
                <svg class="rm-project" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>delete</title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>
            </span>
        </li>
    `).join("");
    
    list.innerHTML = htmlString;
    list.querySelectorAll(".project-item").forEach(item => {
        item.addEventListener("click", () => {
            const id = item.dataset.id;
            state.currentProject = projects.find(p => p.id === id);
            renderProjectView();
            taskLoader(state.currentProject.tasks);
        });
    });
}
export const renderProjectView = () => {
    
    const content = document.getElementById("content");
    content.innerHTML = `
        <div class="task-list-header">
            <div class="task-columns">
                <span>Title</span>
                <span>Description</span>
                <span>Date</span>
                <span>Priority</span>
                <span>Notes</span>
            </div>
            <button id="add-task-btn" class="add-task-btn">+</button>
        </div>
        <div id="tasks-container"></div> 
    `;
    document.getElementById("add-task-btn").addEventListener("click", () => {
        console.log("hello")
        createTaskModal(); 
    });
};
