const path = require('path');
const cp = require('child_process');
const openFallback = require('open');

function open(p) {
    let parsed = p;
    if (typeof parsed === 'string') {
        parsed = {target: parsed};
    }

    if (parsed.error) {
        throw new Error(parsed.error);
    }

    const args = [
        path.join(__dirname, 'app'),
        parsed.target
    ];

    if (parsed.width) {
        args.push('--width', parsed.width);
    }
    if (parsed.height) {
        args.push('--height', parsed.height);
    }
    if (parsed.focus === false) {
        args.push('--without-focus');
    }
    if (parsed.alwaysOnTop) {
        args.push('--always-on-top');
    }
    if (parsed.fullscreen) {
        args.push('--fullscreen');
    }
    if (parsed.disableMenu) {
        args.push('--disable-menu');
    }

    try {
        const electron = require('electron');
        const p = cp.spawn(electron, args, {
            stdio: 'ignore',
            detached: true
        });
        p.unref();
        return p;
    } catch (e) {
        if (parsed.fallback) {
            openFallback(parsed.target);
            return null;
        } else {
            throw new Error('Electron binary was not found. Please ensure to install "electron" package in your machine.');
        }
    }
}

module.exports = open;
