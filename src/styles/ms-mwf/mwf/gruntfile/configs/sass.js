module.exports = {
    localize: {
        options: {
            sourceComments: true
        },
        files: [
            {
                expand: true,
                cwd: 'temp/scss',
                src: '*.scss',
                dest: 'temp/css/',
                ext: '.css'
            }
        ]
    },
    mdl: {
        files: [
            {
                expand: true,
                cwd: 'partners/mdl/styles',
                src: '*.scss',
                dest: 'temp/css/',
                ext: '.css'
            }
        ]
    },
    partnerReports: {
        options: {
            outputStyle: 'expanded'
        },
        files: [
            {
                expand: true,
                cwd: 'temp/scss/partners/<%= partner %>/templates/',
                src: '**/*.scss',
                dest: 'partners/<%= partner %>/templates/',
                ext: '.css'
            }
        ]
    },
    reports: {
        options: {
            outputStyle: 'expanded'
        },
        files: [
            {
                expand: true,
                cwd: 'temp/scss/core/templates/',
                src: '**/*.scss',
                dest: 'core/templates/',
                ext: '.css'
            }
        ]
    },
    staging: {
        files: [
            {
                expand: true,
                cwd: 'partners/modx/styles',
                src: '*.scss',
                dest: 'temp/local/css/',
                ext: '.css'
            }
        ]
    }
};