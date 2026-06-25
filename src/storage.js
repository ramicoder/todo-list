export function saveData(workspaces) {

    const textData = JSON.stringify(workspaces);
    localStorage.setItem("todoApp", textData);
}

export function loadData() {
    
    const savedText = localStorage.getItem("todoApp");
    
    if (!savedText) {
        return [];
    }

    return JSON.parse(savedText);
}