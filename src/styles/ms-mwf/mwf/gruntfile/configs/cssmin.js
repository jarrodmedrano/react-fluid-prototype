module.exports = {
    options: {
        processImport: false,
        report: 'gzip',
        sourceMap: false
    },
    temp: {
        files: [{
            expand: true,
            cwd: 'temp/css',
            src: ['*.css', '!*.min.css'],
            dest: 'temp/css',
            ext: '.min.css'
        }]
    },
    validate: {
        files: [{
            expand: true,
            cwd: 'dist/css',
            src: ['*-ltr-west-european-*.css', '*-rtl-arabic-*.css', '!*.min.css'],
            dest: 'dist/css',
            ext: '.min.css'
        }]
    }
};