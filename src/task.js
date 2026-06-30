import { format, parseISO } from 'date-fns';
import { state } from './index.js';
import { saveData } from './storage.js';

export default class Task {

    constructor(title, descript, date, priority, notes, checked = false) {
        this.title = title;
        this.descript = descript;
        this.date = format(parseISO(date), 'yyyy-MM-dd');
        this.priority = priority;
        this.notes = notes;
        this.checked = checked;
        this.id = crypto.randomUUID();
    }


}  
const showCard = (title, text) => {

    const existing = document.getElementById("info-card");
    if (existing) existing.remove();

    const card = document.createElement("div");
    card.id = "info-card";
    card.innerHTML = `
        <div class="card-content">
            <h3>${title}</h3>
            <br><br>
            <p>${text || "No content provided."}</p>
            <br>
            <button id="close-card">Close</button>
        </div>
    `;

    document.body.appendChild(card);
    document.getElementById("close-card").onclick = () => card.remove();
};
export const taskLoader = (tasks) => {
    const tasksContainer = document.getElementById("tasks-container");


    if (!tasksContainer) return; 

    if (!tasks || tasks.length === 0) {
        tasksContainer.innerHTML = "<p style='color: #888; padding: 20px;'>No tasks yet.</p>";
        return;
    } 

    tasksContainer.innerHTML = tasks.map(task => `
        <div class="task-item ${task.checked ? 'completed' : ''}" data-id="${task.id}">
            <span style="padding-left: -20px;" class="task-title">${task.title}</span>
            
            <div class="icon-wrap">
                <button class="icon-btn" title="Description">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>information-outline</title><path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" /></svg>
                </button>
            </div>
            
            <span class="task-date">${task.date}</span>
            
            <span class="task-priority">${task.priority}</span>
            <div class="icon-wrap">
                <button class="icon-btn" title="Notes">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>note-outline</title><path d="M14,10H19.5L14,4.5V10M5,3H15L21,9V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3M5,5V19H19V12H12V5H5Z" /></svg>
                </button>
            </div>
            
            
            <input type="checkbox" class="task-checkbox" ${task.checked ? 'checked' : ''}>
            <div class="task-actions">
                <button class="icon-btn edit-btn" title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>
                </button>
                <button class="icon-btn delete-btn" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>delete</title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>
                </button>
            </div>
        </div>
    `).join("");

    tasksContainer.onclick = (e) => {

        
        const taskItem = e.target.closest(".task-item");
        if (!taskItem) return;
        
        
        const taskId = taskItem.dataset.id;
        const task = state.currentProject.getTask(taskId); 

        if (e.target.classList.contains("task-checkbox")) {
            
            state.currentProject.toggleTask(taskId);
            saveData(); 
            taskLoader(state.currentProject.tasks);
            return;
        }
        const btn = e.target.closest(".icon-btn");
        
        if (!btn) return;

        if (btn.classList.contains("delete-btn")) {
            state.currentProject.deleteTask(taskId);
            taskLoader(state.currentProject.tasks); 
        } 
        else if (btn.title === "Description") {
            showCard("Description", task.descript);
        } 
        else if (btn.title === "Notes") {
            showCard("Notes", task.notes);
        }
        else if (btn.title === "Edit") {
            editTaskForm(task);
        }
    };
};

function editTaskForm(task) {

    const existing = document.getElementById("edit-modal");
    if (existing) existing.remove();

    const modal = document.createElement("div");
    modal.id = "edit-modal";

    modal.innerHTML = `
        <form id="edit-form" class="card-content edit-form">
            <h3>Edit Task</h3>
            <input type="text" id="edit-title" value="${task.title}" required>
            <input type="textarea" id="edit-desc" value="${task.descript}" required>
            <input type="date" min="2026-06-28" id="edit-date" value="${task.date}" required>
            <input type="number" id="edit-priority" value="${task.priority}" min="1" max="5" required>
            <input type="textarea" maxlength="70" id="edit-notes" value="${task.notes}" required>
            
            <p id="edit-error" style="color: #fbfbfb; display: none; font-size: 0.9em; margin: 5px 0;">No changes were made.</p>
            
            <div class="modal-actions">
                <button id="save-edit-btn" class="submit-btn">Save</button>
                <button id="cancel-edit-btn" class="cancel-btn">Cancel</button>
            </div>
        </form>
    `;

    document.getElementById("content").appendChild(modal);


    document.getElementById("cancel-edit-btn").onclick = () => modal.remove();

    document.getElementById("edit-form").onsubmit = (e) => {
        e.preventDefault();
        const newDetails = {
            title: document.getElementById("edit-title").value,
            descript: document.getElementById("edit-desc").value,
            date: document.getElementById("edit-date").value,
            priority: document.getElementById("edit-priority").value,
            notes: document.getElementById("edit-notes").value
        };
        const hasChanged = Object.keys(newDetails).some(key => newDetails[key] !== String(task[key]));

        if (!hasChanged) {
            document.getElementById("edit-error").style.display = "block"; 
            return; 
        }

        
        state.currentProject.editTask(task.id, newDetails);
        saveData(state);
        taskLoader(state.currentProject.tasks); 
        modal.remove(); 
    };
};