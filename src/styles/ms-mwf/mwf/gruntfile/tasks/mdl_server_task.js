module.exports = function(grunt) {
    grunt.registerTask('mdl-server', [
        'clean-dist-temp',
        'mdl',
        'connect:default',
        'notify:mdlStarted',
        'watch:mdl'
    ]);
}