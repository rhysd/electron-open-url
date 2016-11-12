const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const fs = require('fs');

win = null;

function getUrlToOpen(argv) {
    const url = argv[2];
    if (url.startsWith('https://') || url.startsWith('http://') || url.startsWith('file://')) {
        return url;
    }

    try {
        if (fs.statSync(url).isFile()) {
            return 'file://' + url;
        }
    } catch (e) {
        return '';
    }

    return '';
}

const shouldQuit = app.makeSingleInstance((argv, workdir) => {
    if (win !== null) {
        if (win.isMinimized(0)) {
            win.restore();
        }
        win.loadURL(getUrlToOpen(argv));
        win.focus();
    }
});

if (shouldQuit) {
    app.quit();
}

app.once('ready', () => {
    win = new BrowserWindow({
        width: 1000,
        height: 800,
        show: false,
        webPreferrences: {
            nodeIntegration: false,
            sandbox: true
        }
    });

    win.once('closed', () => {
        win = null;
    })

    win.once('ready-to-show', () => {
        win.show();
    });

    win.loadURL(getUrlToOpen(process.argv));
});
