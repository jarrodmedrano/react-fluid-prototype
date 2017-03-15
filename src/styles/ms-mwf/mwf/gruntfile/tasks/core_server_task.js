module.exports = function(grunt) {
    grunt.registerTask('core-server', [
        'clean-dist-temp',
        'check-available-port',
        'build-core',
        'connect:default',
        'focus:core'
    ]);
}