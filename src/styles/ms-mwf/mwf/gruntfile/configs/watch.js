var grunt = require('grunt');

var sassTaskConfig = grunt.option("partner") ? ["clean:temp", "build-sass:core", `build-sass:${grunt.option("partner")}`, 'copy:css'] : ['clean:temp', 'build-sass:core', 'copy:css']

module.exports = {
    options: {
        interrupt: true,
        livereload: true
    },
    dev: {
        files: [
            'core/fonts/**/*.*',
            'gruntfile.js'
        ],
        tasks: ['default']
    },
    handlebars: {
        files: [
            'core/**/*.+(hbs|json)'
        ],
        tasks: [
            'core-build-html'
        ]
    },
    js: {
        files: [
            'core/scripts/test/**/*.js'
        ],
        tasks: [
            'copy:devToolBar'
        ]
    },
    mdl: {
        files: [
            'core/**/*.*',
            'partners/mdl/**/*.*',
            'gruntfile.js'
        ],
        tasks: ['mdl']
    },
    partner: {
        files: [
            '!core/templates/mwf.main.withmocks.ts',
            'partners/' + grunt.option('partner') + '/**/*.+(hbs|json|png)'
        ],
        tasks: ['build-partner:' + grunt.option('partner')]
    },
    partnersAll: {
        files: [
            '{core,partners}/**/*.*',
            'gruntfile.js'
        ],
        tasks: ['build-all-partners']
    },
    sass: {
        files: [
            '{core,partners}/**/styles/**/*.scss',
            '!core/styles/_normalize.scss'
        ],
        tasks: sassTaskConfig
    },
    staging: {
        options: {
            livereload: false
        },
        files: [
            'partners/modx/**/*.*',
            'gruntfile.js'
        ],
        tasks: ['staging']
    },
    ts: {
        files: [
                '{core,partners}/**/scripts/**/*.ts',
                '!core/scripts/vendor/*.min.ts'
            ],
        tasks: [
            'core-build-ts'
        ]
    }
}