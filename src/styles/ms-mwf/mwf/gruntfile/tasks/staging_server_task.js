module.exports = function(grunt) {
    grunt.registerTask('staging-server', [
        'notify:stagingStarted',
        'watch:staging'
    ]);
}