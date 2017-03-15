module.exports = {
    options: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        removeComments: true,
        removeStyleLinkTypeAttributes: true,
        removeScriptTypeAttributes: true,
    },
    dist: {
        files: [{
            expand: true,
            cwd: 'dist',
            src: ['**/*.html', '!chunks/document-open.html', '!chunks/document-close.html'],
            dest: 'dist'
        }]
    },
    core: {
        files: [{
            expand: true,
            cwd: 'dist/core',
            src: '**/*.html',
            dest: 'dist/core'
        }]
    },
    coreReports: {
        files: [{
            expand: true,
            cwd: 'core/templates',
            src: ['**/*.html', '!**/README.html', '!**/fixtures/**/*.html'],
            dest: 'core/templates'
        }]
    },
    partnerReports: {
        files: [{
            expand: true,
            cwd: 'partners/<%= partner %>/templates/',
            src: ['**/*.html', '!**/README.html'],
            dest: 'partners/<%= partner %>/templates/'
        }]
    }
};