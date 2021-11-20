import { dialog } from 'electron'
import { autoUpdater } from 'electron-updater'

const DIALOG_OPTS = {
    title: "Update available",
    message: "There's a Linked update available. Do you want to update?",
    detail: "TIP: you can disable automatic updates in the settings.",
    type: "question",
    buttons: ["Remind me later", "OK"],
    defaultId: 1, // ok button
    noLink: true
}

autoUpdater.autoDownload = false

autoUpdater.on('update-available', async () => {
    const { response } = await dialog.showMessageBox(DIALOG_OPTS)
    if (response === 1) { //ok button has been clicked
        autoUpdater.downloadUpdate()
    }
})
autoUpdater.on('update-not-available', async () => {
    await dialog.showMessageBox({
        title: 'Updates not available',
        message: "There isn't any update available. Sorry :(",
        buttons: ["OK"]
    })
})
autoUpdater.on('update-downloaded', async () => {
    autoUpdater.quitAndInstall()
})

async function askForUpdates() {
    if (!global.storage.get("enableUpdates")) return
    await autoUpdater.checkForUpdates()
}

function setupUpdates() {
    setInterval(() => askForUpdates(), global.storage.get("updateInterval"))
}

export default { setupUpdates, askForUpdates }
