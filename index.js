const path = require('path');
const child_process = require('child_process');
const openFallback = require('open');

let electron;
try {
    electron = require('electron');
} catch (e) {
    electron = null;
}

function open(parsed) {
    if (typeof parsed === 'string') {
        parsed = { target: parsed };
    }

    if (parsed.error) {
        throw new Error(parsed.error);
    }

    if (electron === null) {
        if (parsed.fallback) {
            openFallback(parsed.target);
        } else {
            throw new Error('Electron binary was not found. Please ensure to install "electron" package in your machine.');
        }
    }

    child_process.spawn(electron, [
        path.join(__dirname, 'app'),
        parsed.target
    ], {
        stdio: 'ignore',
        detached: true
    }).unref();
}

module.exports = open;
