import "./styles.css";
import Task from "./task.js";
import Project from "./project.js";
import Workspace from "./workspace.js";
import { saveData, loadData } from "./storage.js";

const rawData = loadData();
const content = document.querySelector("#content");
//localStorage.clear()
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

function createWorkSpaceModal() {
   const modal = document.createElement("div");
   modal.id = "workspace-modal";
   modal.classList.add("modal");
   modal.style.display = "none";
   modal.innerHTML = `<form id="workspace-form">
        <h2>New Workspace</h2>
        <input type="text" id="workspace-title" placeholder="Workspace Name" required>
        <button onclick="document.getElementById('workspace-modal').remove()" type="button" id="cancel-workspace-btn">Cancel</button>
        <button type="submit">Create</button>
    </form>`;
    content.appendChild(modal);
    const form = document.getElementById('workspace-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); 
        const titleInput = document.getElementById('workspace-title');
        createWorkspace(titleInput.value);
        updateWorkspaceDropdown();
        titleInput.value = '';
        const modal = document.getElementById('workspace-modal');
        modal.style.display = "none";
    })

}
const addWsBtn = document.getElementById("add-workspace-btn");
addWsBtn.addEventListener("click", () => {
    createWorkSpaceModal();
    const modal = document.getElementById("workspace-modal");
    modal.style.display = "flex";
})

function updateWorkspaceDropdown() {
    const select = document.getElementById("workspace-selector");
    
    select.innerHTML = '<option value="default">Choose a Workspace</option>';

    workspaces.forEach(ws => {
        const option = document.createElement("option");
        option.value = ws.id;
        option.textContent = ws.title;
        select.appendChild(option);
    });
}
