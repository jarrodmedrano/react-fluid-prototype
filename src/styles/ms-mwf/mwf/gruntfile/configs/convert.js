module.exports = {
    options: {
        explicitArray: false
    },
    xml2json: {
        files: [{
            expand: true,
            cwd: 'temp/',
            src: ['uhf.xml'],
            dest: 'temp/',
            ext: '.json'
        }]
    }
};