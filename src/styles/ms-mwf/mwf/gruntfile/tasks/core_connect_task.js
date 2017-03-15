module.exports = function(grunt) {
    grunt.registerTask('core-connect', [
        'connect:default',
        'focus:core'
    ]);
}