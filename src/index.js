import "./styles.css";
import Task from "./task.js";
import Project from "./project.js";
import Workspace from "./workspace.js";
import { saveData, loadData } from "./storage.js";

const workspaces = loadData();;
function createWorkspace(title) {
    if (workspaces.length >= 2) {
        console.log("To have more than 2 workspaces, please proceed to payment for subscription.");
        return;
    } else {
        const newWorkspace = new Workspace(title);
        workspaces.push(newWorkspace);
        saveData(workspaces);
    }
}

createWorkspace("hello", ["hi"]);






