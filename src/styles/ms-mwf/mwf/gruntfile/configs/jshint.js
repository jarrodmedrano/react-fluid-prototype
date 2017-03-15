module.exports = {
    options: {
        "-W097": true, // Ignore "use function version of "use-strict"".
        esnext: true,
        globals: {
            microsoft: true,
            window: true,
            document: true,
            console: true,
            Hammer: true
        }
    },
    core: {
        src: [
            "core/scripts/mwf/**/*.js",
            "core/templates/**/scripts/**/*.js",
            "!core/templates/**/scripts/**/deprecated/*.js",
            "!core/templates/**/vendor/**/*.js"
        ]
    },
    devToolBar: {
        src: [
            "core/scripts/test/dev-toolbar.js"
        ]
    },
    partner: {
        src: [
            "partners/<%= partner %>/**/*.js",
            "!partners/<%= partner %>/**/vendor/**/*.js"
        ]
    }
};