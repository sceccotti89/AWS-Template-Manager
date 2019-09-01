const { ipcRenderer } = require('electron');
const STORAGE_FILES = "files";

// Read 'openFile' events when new files are selected.
ipcRenderer.on('openFile', (event, message) => {
    const files = message.filePaths;
    if (typeof(Storage) !== "undefined") {
        const storage = window.localStorage;
        const openFiles = JSON.parse(storage.getItem(STORAGE_FILES)) || [];

        files.forEach((filePath) => {
            if (!openFiles.some((file) => file === filePath)) {
                openFiles.push(filePath);
                openFile(filePath);
            }
        });

        storage.setItem(STORAGE_FILES, JSON.stringify(openFiles));
    }
});

const loadOpenFiles = () => {
    if (typeof(Storage) !== "undefined") {
        const storage = window.localStorage;
        const openFiles = JSON.parse(storage.getItem("files")) || [];
        openFiles.forEach((filePath) => openFile(filePath));
    }
}

const openFile = (filePath) => {
    const xhr = new XMLHttpRequest();
    xhr.onloadend = (event) => {
        if (event.loaded && xhr.response) {
            const contents = xhr.responseText;
            displayContents(contents);
        } else {
            const storage = window.localStorage;
            const files = JSON.parse(storage.getItem(STORAGE_FILES));
            files.splice(files.findIndex((file) => file === filePath), 1);
            storage.setItem(STORAGE_FILES, JSON.stringify(files));
        }
    }
    xhr.open('GET', filePath);
    xhr.send();
}

function displayContents(contents) {
    // TODO show display content
    // const element = document.getElementById('file-content');
    // element.textContent = contents;
}

window.onload = loadOpenFiles();