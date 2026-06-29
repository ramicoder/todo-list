import { format, parseISO } from 'date-fns';
export default class Task {

    constructor(title, descript, date, notes, priority, checked = false) {
        this.title = title;
        this.descript = descript;
        this.date = format(parseISO(date), 'yyyy-MM-dd');
        this.priority = priority;
        this.notes = notes;
        this.checked = checked;
        this.id = crypto.randomUUID();
    }

    
}  
export const taskLoader = (tasks) => {
    const tasksContainer = document.getElementById("tasks-container");
    
    // Failsafe in case the container doesn't exist yet
    if (!tasksContainer) return; 

    if (!tasks || tasks.length === 0) {
        tasksContainer.innerHTML = "<p style='color: #888; padding: 20px;'>No tasks yet.</p>";
        return;
    } 

    tasksContainer.innerHTML = tasks.map(task => `
        <div class="task-item" data-id="${task.id}">
            <div class="task-details">
                <span>${task.title}</span>
                <span>${task.descript}</span>
                <span>${task.date}</span>
                <span>${task.priority}</span>
                <span>${task.notes}</span>
            </div>
            <div class="task-actions">
                <span class="icon-edit"></span>
                <span class="icon-delete"></span>
            </div>
        </div>
    `).join("");
};
