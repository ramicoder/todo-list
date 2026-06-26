import "./styles.css";
import Task from "./task.js";
import Project from "./project.js";
import Workspace from "./workspace.js";
import { saveData, loadData } from "./storage.js";

const rawData = loadData();

let workspaces = rawData.map(data => {

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

function createWorkspace(title, projects = []) {
    if (workspaces.length >= 2) {
        console.log("To have more than 2 workspaces, please proceed to payment for subscription.");
        return;
    } else {
        const newWorkspace = new Workspace(title, projects);
        workspaces.push(newWorkspace);
        saveData(workspaces);
        return newWorkspace;
    }
}

function deleteWorkspace(targetId) {

    workspaces = workspaces.filter(workspace => workspace.id !== targetId);
    saveData(workspaces);
}




