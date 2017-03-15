module.exports = {
    'ts-core-debug': {
        command: 'gulp debug'
    },
    'ts-core-prod': {
        command: 'gulp release'
    },
    'ts-var-bundle-debug': {
        command: 'npm run-script debugVarBundle'
    },
    'ts-core-bundle-debug': {
        command: 'npm run-script debugBundle' 
    },
    'ts-core-bundle-release': {
        command: 'npm run-script releaseBundle'
    },
    'ts-lint': {
        command: 'gulp ts-lint'
    },
    'html-lint': {
        command: 'gulp html5-lint-core'
    },
    'oneplayer-bundle-debug': {
        command: 'npm run oneplayerDebugBundle'
    },
    'oneplayer-bundle-release': {
        command: 'npm run oneplayerReleaseBundle'
    }
};