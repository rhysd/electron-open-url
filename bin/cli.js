#! /usr/bin/env node

const openElectron = require('..');

function parseArgv(argv) {
    if (argv.indexOf('--help') !== -1) {
        return {
            help: true
        };
    }

    const fallback_idx = argv.indexOf('--with-fallback');
    if (fallback_idx >= 0) {
        argv.splice(fallback_idx, 1);
    }

    if (argv.length === 0) {
        return {
            error: 'target to open was not found.'
        };
    }

    return {
        target: argv[0],
        fallback: fallback_idx >= 0
    };
}

const parsed = parseArgv(process.argv.slice(2));
if (parsed.help) {
    process.stderr.write(
`
$ electron-open {something} [--help|--with-fallback]
`
    );
    process.exit(0);
}

try {
    openElectron(parsed);
} catch (e) {
    process.stderr.write('Error: ' + e.message + ' Please see --help for more detail.\n');
}
