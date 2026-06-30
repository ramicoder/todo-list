import Workspace from "./workspace.js";
import { Project } from "./project.js";
import Task from "./task.js";
import { workspaces } from "./index.js";

export function saveData(workspaces) {

    const textData = JSON.stringify(workspaces);
    localStorage.setItem("todoApp", textData);
}

export function loadData() {
    
    const savedText = localStorage.getItem("todoApp");
    
    if (!savedText) {
        return [];
    }
    try {
        const rawData = JSON.parse(savedText);
        
        return Array.from(rawData).map(data => {
            const ws = new Workspace(data.title);
            ws.id = data.id;

            ws.projects = data.projects.map(projData => {
                const p = new Project(projData.title);
                p.id = projData.id;

                p.tasks = projData.tasks.map(taskData => {
                    const t = new Task(
                        taskData.title,
                        taskData.descript,
                        taskData.date,
                        taskData.priority,
                        taskData.notes,
                        taskData.checked
                    );
                    t.id = taskData.id;
                    return t;
                });
                return p;
            });
            return ws;
        });
    } catch (error) {
        console.error("Failed to parse localStorage data. Resetting to empty.", error);
        return []; 
    }
}