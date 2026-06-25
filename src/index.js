import "./styles.css";
import Task from "./task.js";
import Project from "./project.js";
import Workspace from "./workspace.js";

const workspaces = [];
function createWorkspace(title) {
    if (workspaces.length >= 2) {
        console.log("To have more than 2 workspaces, please proceed to payment for subscription.");
    } else {
        const newWorkspace = new Workspace(title);
        workspaces.push(newWorkspace);
    }
}


createWorkspace("Freelance Gigs");
createWorkspace("Personal Life");
createWorkspace("Startup Idea"); 


