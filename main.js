const { app, BrowserWindow, ipcMain, dialog, shell, Menu, Tray, session } = require('electron')
const { autoUpdater, AppUpdater } = require("electron-updater");
const { download } = require("electron-dl")

const os = require('os')
const path = require('path');
const fs = require('fs');
const url = require('url');
const { start } = require('repl');
const { request } = require('http');

const pathAppLocal = path.join(app.getPath('home'), "AppData/Local/LopHocApp");

var Cookie = {
    "Remenber": null,
    "LoginOTP": null,
    "Net_SessionId": null,
    "TNTokenID": null
}
var Setting = {
    "theme": 'dark',
    "path": null,
    "version": null,
    "lastVersion": null,
    "autoUpdate": false,
    "runBackground": false
}

// get setting and cooke
if (!fs.existsSync(pathAppLocal)) {
    fs.mkdirSync(pathAppLocal)
}

if (fs.existsSync(pathAppLocal + '/cookie.json')) {
    var temlay = JSON.parse(fs.readFileSync(pathAppLocal + '/cookie.json'))
    Object.keys(Cookie).forEach(e => {
        Cookie[ e ] = temlay[ e ] || Cookie[ e ]
    })
}
else {
    fs.writeFileSync(pathAppLocal + '/cookie.json', JSON.stringify(Cookie))
}

if (fs.existsSync(pathAppLocal + '/setting.json')) {
    var temlay = JSON.parse(fs.readFileSync(pathAppLocal + '/setting.json'))

    Object.keys(Setting).forEach(e => {
        Setting[ e ] = temlay[ e ] || Setting[ e ]
    })
}
else
    fs.writeFileSync(pathAppLocal + '/setting.json', JSON.stringify(Setting))

Setting[ "path" ] = null
Setting[ "version" ] = app.getVersion()
if (process.argv.length >= 2) {
    let filePath = process.argv[ 1 ];
    Setting[ "path" ] = filePath
}

//Basic flags
autoUpdater.autoDownload = Setting[ "autoUpdate" ];
autoUpdater.autoInstallOnAppQuit = true;

let win;

const createWindow = () => {
    win = new BrowserWindow({
        title: "lop hoc",
        width: 1000,
        height: 600,
        minWidth: 700,
        maxHeight: 900,
        maxWidth: 1400,
        frame: false,
        removeMenu: true,
        acceptFirstMouse: true,
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            webviewTag: true
        },
    })

    // win.loadFile('./render/index.html')
    win.loadURL(url.format({
        pathname: path.join(__dirname, './render/index.html'),
        protocol: 'file:',
        slashes: true
    }))

}

let tray = null
app.whenReady().then(() => {
    tray = new Tray(path.join(__dirname, './build/icon.png'))
    const contextMenu = Menu.buildFromTemplate([
        {label: "check Update" , type:"normal" , click: () => {

        }},
        {label:"Exit" , click: () => {
            app.quit()
        }}
    ])


    tray.on('click' , (e) => {
        if (!BrowserWindow.getAllWindows().length) {
            createWindow()
        }
    })
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)
    createWindow()

    ipcInit()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    if (Setting[ 'autoUpdate' ])
        autoUpdater.checkForUpdates()
})
//===============================================================

/*New Update Available*/
autoUpdater.on("update-available", (info) => {
    win.webContents.send("updateMessage", `install ${info.version}`);
});

autoUpdater.on("update-not-available", (info) => {
    win.webContents.send("updateMessage" ,`no update`);
});

/*Download Completion Message*/
autoUpdater.on("update-downloaded", (info) => {
    win.webContents.send("updateMessage" ,`Commlit`);
});

autoUpdater.on("error", (info) => {
    win.webContents.send("updateMessage" , 'error');
});

//================================================================

app.on('window-all-closed', () => {
    console.log('all window closed')
})

function ipcInit() {

    const ws = win.webContents
    
    ipcMain.handle("export", async (sender, path) => {
        // console.log(path)
        await ws.capturePage().then(image => {
            fs.writeFileSync(path, image.toPNG(), (err) => { if (err) return false })
        })

        return true
    })

    ipcMain.handle("showOpenDialog", async (sender) => {
        const { canceled, filePaths } = await dialog.showOpenDialog(win, {
            properties: [ 'openDirectory' ]
        })

        if (canceled) {
            return
        } else {
            return filePaths[ 0 ]
        }
    })


    // window_ipc ============================
    ipcMain.on("closeApp", () => {

        if (Cookie.Remenber) {
            const strCooke = JSON.stringify(Cookie);
            fs.writeFileSync(pathAppLocal + '/cookie.json', strCooke);
        }
        else {
            const strCooke = JSON.stringify({});
            fs.writeFileSync(pathAppLocal + '/cookie.json', strCooke);
        }

        fs.writeFileSync(pathAppLocal + '/setting.json', JSON.stringify(Setting))
        win.close()
        console.log(Setting.runBackground)
        if (!Setting.runBackground) {
            app.quit()
        }

    })

    ipcMain.on("minimizeApp", () => {
        win.minimize()
    })

    // dow handl ===============================
    // infor 
    // {
    //     url: "URL is here",
    //     properties: {directory: "Directory is here"}
    // }
    ipcMain.on("download", (event, { id, info }) => {
        console.log(id, info)
        info.properties.onProgress = status => {
            win.webContents.send("download progress", {
                id: id,
                status: status
            })
        };
        download(BrowserWindow.getFocusedWindow(), info.url, info.properties)
            .then(dl => {
                win.webContents.send("download complete", id)
            });

    })

    ipcMain.on('checkUpdate', (sender) => {
        win.webContents.send("updateMessage", '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>')
        autoUpdater.checkForUpdates()
    })

    ipcMain.on('dowloadUpdate', (sender) => {
        win.webContents.send("updateMessage", '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>')
        var path = autoUpdater.downloadUpdate()
        // win.webContents.send("updateApp" , path)

    })

    ipcMain.on('openLink', (sender, link) => {
        shell.openExternal(link)
    })

    // Cookie ipc ============================
    ipcMain.on("setCookie", (sender, data) => {
        Cookie[ data.key ] = data.value;
    })

    ipcMain.on("setAllCookie", (sender, data) => {
        Cookie = data;
        console.log(data)
        const strCooke = JSON.stringify(Cookie);
        fs.writeFileSync(pathAppLocal + '/cookie.json', strCooke);
    })

    ipcMain.handle("logout", (sender) => {
        Cookie = {};
        const strCooke = JSON.stringify({});
        fs.writeFileSync(pathAppLocal + '/cookie.json', strCooke);
        return Cookie;
    })

    ipcMain.handle("getCookie", (event, key) => {
        return Cookie[ key ];
    })

    ipcMain.handle("getAllCookie", (event) => {
        return Cookie;
    })

    // setting ipc =============================
    ipcMain.on('setSetting', (sender, data) => {
        Setting[ data.key ] = data.value;
    })
    ipcMain.handle('getSetting', (sender, key) => {
        return Setting[ key ]
    })
    ipcMain.handle('getAllSetting', (sender) => {
        return Setting
    })

    ipcMain.on('setAllSetting', (sender, data) => {
        Setting = data
        const str = JSON.stringify(Setting)
        fs.writeFileSync(pathAppLocal + '/setting.json', str)
    })

    // export file img
}
