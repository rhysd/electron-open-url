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

function getWindowSize(argv) {
    const size = {
        height: undefined,
        width: undefined
    };

    const wi = argv.indexOf('--width');
    if (wi !== -1) {
        size.width = parseInt(argv[wi + 1], 10);
    }

    const hi = argv.indexOf('--height');
    if (hi !== -1) {
        size.height = parseInt(argv[hi + 1], 10);
    }

    return size;
}

const shouldQuit = app.makeSingleInstance((argv, workdir) => {
    if (win !== null) {
        if (win.isMinimized(0)) {
            win.restore();
        }
        const size = getWindowSize(argv);
        if (size.width || size.height) {
            win.setSize(size.width, size.height);
        }
        win.loadURL(getUrlToOpen(argv));
        win.focus();
    }
});

if (shouldQuit) {
    app.quit();
}

app.once('ready', () => {
    const size = getWindowSize(process.argv);

    win = new BrowserWindow({
        width: size.width || 1000,
        height: size.height || 800,
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
