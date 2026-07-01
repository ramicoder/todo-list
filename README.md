# Task Manager App

A robust, vanilla JavaScript task management application built as a full-stack web development portfolio piece, emphasizing modularity and SOLID principles. 

## Live Repo: https://ramicoder.github.io/todo-list/

## 🚀 Features

* **Workspaces & Projects:** Organize tasks logically into separate, manageable project lists.
* **Full Task Management:** Add, complete, edit, and delete tasks dynamically. 
* **Persistent Storage:** Automatically saves all workspaces and tasks to the browser's Local Storage. Data is safe across refreshes.
* **Smart Sorting:** Quickly sort tasks chronologically by date or by priority level.
* **Clean UI:** Built with CSS Grid and Flexbox for a perfectly aligned, responsive, and modern interface.

## 🛠️ Built With

* **HTML5 & CSS3** 
* **Vanilla JavaScript** (ES6+ Modules)
* **Webpack** (Module bundling)
* **Local Storage API**

## 💻 Getting Started

1. Clone this repository to your local machine.
2. Run `npm install` to install Webpack dependencies.
3. Run `npm run build` to compile the JavaScript modules.
4. Open `dist/index.html` in your web browser to start managing tasks.

## 🧠 Architecture Notes

* Implements the **Single Responsibility Principle (SRP)** by decoupling UI rendering logic from data manipulation.
* Structured following The Odin Project curriculum best practices.
* Uses robust error handling and validation logic to prevent Local Storage corruption.
