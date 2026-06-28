import Project from "./project.js"
export default class Workspace {
    constructor(title, projects = []) {
        this.title = title;
        this.projects = projects;
        this.id = crypto.randomUUID();
    }

    addProject(project) {
        this.projects.push(project);
    }

    deleteProject(targetId) {

        this.projects = this.projects.filter
            (project => project.id !== targetId);
    }

    editProject(targetId, title) {
        
        const project = this.projects.find(p => p.id === targetId); 
        if (project) {
            project.title = title;
        }
    }
}