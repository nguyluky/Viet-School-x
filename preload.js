const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('CookieIpc', {
    set: (k, v) => {
        ipcRenderer.send("setCookie", { key: k, value: v });
    },
    get: (key) => {
        return ipcRenderer.invoke("getCookie", key);
    },

    all: () => {
        return ipcRenderer.invoke("getAllCookie");
    },

    setAll: (data) => {
        ipcRenderer.send('setAllCookie', data)
    },

    clear: () => ipcRenderer.invoke('logout')
})

contextBridge.exposeInMainWorld('SettingIpc', {
    set: (k, v) => {
        ipcRenderer.send('setSetting', { key: k, value: v });
    },
    get: (k) => {
        return ipcRenderer.invoke('getSetting', k)
    },

    getAll: () => {
        return ipcRenderer.invoke('getAllSetting')
    },

    setAll: (data) => {
        ipcRenderer.send('setAllSetting', data)
    }

})

contextBridge.exposeInMainWorld("App", {
    close: () => {
        ipcRenderer.send("closeApp")
    },

    minimize: () => {
        ipcRenderer.send('minimizeApp')
    },

    screenshot: (path) => {
        return ipcRenderer.invoke('export', path)
    },

    showOpenDialog: () => {
        return ipcRenderer.invoke('showOpenDialog')
    },

    downloadFile: (info) => {
        ipcRenderer.send("download", info);
    },

    openLink: (link) => {
        ipcRenderer.send("openLink", link)
    },

    checkUpdate: () => ipcRenderer.send('checkUpdate'),

    downloadUpdate: () => ipcRenderer.send('dowloadUpdate')

})

ipcRenderer.on("download progress", (event, { id, status }) => {

    var load = document.querySelector(`.file-view.file${id} > .load`)
    load.style.display = "block"

    var a = document.querySelector(`.file-view.file${id} > .load > div`)
    a.style.width = status.percent * 100 + "%"

});

let bridge = {
    updateMessage: (callback) => ipcRenderer.on("updateMessage", callback),
};

contextBridge.exposeInMainWorld("bridge", bridge);