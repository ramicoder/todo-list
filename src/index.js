import "./styles.css";
import Task from "./task.js";
import {Project, projectLoader, renderProjectView} from "./project.js";
import Workspace from "./workspace.js";
import { saveData, loadData } from "./storage.js";
import sanitizeHTML from "./sanitize.js";
import { parseISO } from 'date-fns';
import { taskLoader } from "./task.js";
//localStorage.clear()
const sidebar = document.getElementById("sidebar");
const content = document.querySelector("#content");
const select = document.getElementById("workspace-selector");
const appTitle = document.getElementById("title");
let activeWs;
export let state = { currentProject: null };
let addProjectBtn;

export let workspaces = loadData();

updateWorkspaceDropdown();

function createWorkspace(title, projects = []) {
    if (workspaces.length >= 2) {
        console.log("To have more than 2 workspaces, please proceed to payment for subscription.");
        alert("You reached your workspace limit! To have more than 2 workspaces, please proceed to payment for subscription.");
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
    const existingModal = document.getElementById("workspace-modal");
    if (existingModal) existingModal.remove();
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
    });

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
    if (select.value == "default") {
        return;
    }
    const activeWorkspace = workspaces.find(ws => ws.id === select.value);
    activeWs = activeWorkspace;
    updateTitle();
    sidebar.innerHTML = `
        <div class="buttons">
            <button id="rm-ws-btn">Remove</button>
            <button id="edit-ws-btn">Edit</button>
            <button id="add-project-btn">+ New Project</button>
        </div>
        <div id="projects">
        </div>`;
        
    const rmWsBtn = document.getElementById("rm-ws-btn");
    rmWsBtn.addEventListener("click", () => {
        deleteWorkspace(activeWs.id);
        activeWs = null
        updateWorkspaceDropdown();
        updateTitle();
        sidebar.innerHTML = "";
        content.innerHTML = "";
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

    addProjectBtn = document.getElementById("add-project-btn");
    addProjectBtn.addEventListener("click", createProjectModal);
    projectLoader(activeWs.projects);
    attachIconListeners();
})

function updateTitle() {
    if (!activeWs) {
        appTitle.innerHTML = `<h1>ToDo App</h1>`;
    } else {

        appTitle.innerHTML = `<h1>${sanitizeHTML(activeWs.title)}</h1>`;
    }
}

function createProject(title, tasks = []) {
    const newProject = new Project(title, tasks);
    activeWs.projects.push(newProject);
    saveData(workspaces);
    return newProject;
}

function createProjectModal() {
    const modal = document.createElement("div");
    modal.id = "project-modal";
    modal.classList.add("modal");
    modal.innerHTML = `
    <form id="project-form">
        <h2 style="color: white;">New Project</h2>
        <input type="text" id="project-title" placeholder="Project Name" required>
        <button onclick="document.getElementById('project-modal').remove()" type="button">Cancel</button>
        <button type="submit">Create</button>
    </form>`;
    content.appendChild(modal);

    document.getElementById("project-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const titleInput = document.getElementById("project-title");
        const newProject = new Project(titleInput.value);
        
        activeWs.addProject(newProject);
        saveData(workspaces);
        projectLoader(activeWs.projects);
        attachIconListeners();
        modal.remove();
    });
}

export function createTaskModal() {
    const modal = document.createElement("div");
    modal.id = "task-modal";
    modal.classList.add("modal");
    modal.innerHTML = `
    <form id="task-form">
        <h2 style="color: white;">New Task</h2>
        <input type="text" maxlength="20" id="task-title" placeholder="Task Name" required>
        <input type="textarea" id="task-descript" placeholder="Task Description" required>
        <input type="date" id="task-date" min="2026-06-28" required>
        <input type="textarea" id="task-notes" placeholder="Notes" maxlength="70" required>
        <input type="number" id="task-priority" min="1" max="5" placeholder="#" required>
        <button onclick="document.getElementById('task-modal').remove()" type="button">Cancel</button>
        <button type="submit">Create</button>
    </form>`;
    content.appendChild(modal);

    document.getElementById("task-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const titleInput = document.getElementById("task-title");
        const descriptInput = document.getElementById("task-descript");
        const dateInput = document.getElementById("task-date");
        const notesInput = document.getElementById("task-notes");
        const priorityInput = document.getElementById("task-priority");

        const newTask = new Task(titleInput.value, descriptInput.value, dateInput.value, priorityInput.value, notesInput.value);
        state.currentProject.addTask(newTask);
        saveData(workspaces);
        taskLoader(state.currentProject.tasks);
        modal.remove();
    });
}
function attachIconListeners() {
    document.querySelectorAll('.rm-project').forEach(icon => {
        icon.addEventListener('click', (e) => {
            const projectId = e.target.closest('li').dataset.id;
        
            activeWs.deleteProject(projectId);
            saveData(workspaces);

            projectLoader(activeWs.projects);
            attachIconListeners(); 
        });
    });

    document.querySelectorAll('.edit-project').forEach(icon => {
        icon.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            const projectId = li.dataset.id;
            const titleElement = li.querySelector(".project-title");
            const input = document.createElement("input");
            input.type = "text";
            input.value = titleElement.textContent.trim(); 
            input.required = true;
            
            li.replaceWith(input);
            input.focus();
            

            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter" && input.value.trim() !== "") {
                    titleElement.textContent = input.value;
                    activeWs.editProject(projectId, input.value.trim()); 
                    saveData(workspaces);
                    projectLoader(activeWs.projects);
                    
                    attachIconListeners(); 
                }
            });
        });
    });
}