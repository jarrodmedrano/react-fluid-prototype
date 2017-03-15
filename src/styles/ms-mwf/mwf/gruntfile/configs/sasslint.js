module.exports = {
    options: {
        configFile: './.sass-lint.yml',
        outputFile: './static-reports/sasslint.json',
        formatter: 'json'
    },
    all: {
        options: {
            outputFile: false,
            formatter: null
        },
        files: {
            src: [
                './core/**/styles/**/*.scss',
                './partners/**/styles/**/*.scss'
            ],
            exclude: [
                './core/styles/_normalize.scss',
                './core/styles/utilities/vendor/**/*.scss',
                './partners/uhf/styles/_uhf_normalize.scss',
                './partners/modx/**/*.scss'
            ]
        }
    },
    core: {
        options: {
            outputFile: false,
            formatter: null
        },
        files: {
            src: [
                './core/**/styles/**/*.scss'
            ],
            exclude: [
                './core/styles/_normalize.scss',
                './core/styles/utilities/vendor/**/*.scss'
            ]
        }
    }
};