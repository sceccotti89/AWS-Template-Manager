const loadOpenFiles = () => {
    if (typeof(Storage) !== "undefined") {
        const storage = window.localStorage;
        const openFiles = JSON.parse(storage.getItem("files"));
        if (openFiles) {
            // TODO show as many tabs as open files
            
        }
    }
}

window.onload = loadOpenFiles();