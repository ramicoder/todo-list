import "./styles.css";
import Task from "./task.js";
import Project from "./project.js";
import Workspace from "./workspace.js";
import { saveData, loadData } from "./storage.js";

const rawData = loadData();
const sidebar = document.getElementById("sidebar");
const content = document.querySelector("#content");
const select = document.getElementById("workspace-selector");
const appTitle = document.getElementById("title");
let activeWs;

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

updateWorkspaceDropdown();

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

function editWorkspace(id, title) {
    const workspace = workspaces.find(ws => ws.id === id);
    workspace.title = title;
    saveData(workspaces);
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
    
    select.innerHTML = '<option value="default">Choose a Workspace</option>';

    workspaces.forEach(ws => {
        const option = document.createElement("option");
        option.value = ws.id;
        option.textContent = ws.title;
        select.appendChild(option);
    });
}



select.addEventListener("change", () => {
    const activeWorkspace = workspaces.find(ws => ws.id === select.value);
    activeWs = activeWorkspace;
    updateTitle();
    sidebar.innerHTML = `
        <div class="buttons">
            <button id="rm-ws-btn">Remove</button>
            <button id="edit-ws-btn">Edit</button>
            <button id="add-project-btn">+ New Project</button>
        </div>
        <ul id="project-list"></ul>`;
    const rmWsBtn = document.getElementById("rm-ws-btn");
    rmWsBtn.addEventListener("click", () => {
        deleteWorkspace(activeWs.id);
        activeWs = null
        updateWorkspaceDropdown();
        updateTitle();
    });
    const editWsBtn = document.getElementById("edit-ws-btn");
    editWsBtn.addEventListener("click", () => {
        appTitle.innerHTML = `<input type="text" id="new-workspace-title" placeholder="Workspace Name" required>`;
        const input = document.getElementById("new-workspace-title");
        input.focus();

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && input.value.trim() !== "") {
                activeWs.title = input.value;
                editWorkspace(activeWs.id, activeWs.title);
                updateWorkspaceDropdown(); 
                updateTitle(); 
            }
        });
    });
})

function updateTitle() {
    if (!activeWs) {
        appTitle.innerHTML = `<h1>ToDo App</h1>`;
    } else {

        appTitle.innerHTML = `<h1>${activeWs.title}</h1>`;
    }
}
function createProject(title, tasks = []) {
    const newProject = new Project(title, tasks);
    activeWs.projects.push(newProject);
    saveData(workspaces);
    return newProject;
}

