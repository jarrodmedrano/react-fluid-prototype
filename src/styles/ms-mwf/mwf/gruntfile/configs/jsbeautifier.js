module.exports = {
    reports: {
        options: {
            html: {
                preserveNewlines: false,
                unformatted: []
            }
        },
        files: [
            {
                expand: true,
                cwd: 'core/templates/',
                src: '{components,modules}/**/report/*.html',
                dest: 'core/templates/'
            }
        ]
    }
};