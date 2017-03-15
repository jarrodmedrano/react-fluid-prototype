module.exports = function(grunt) {
    grunt.registerTask('build-scripts-core', [
        'browserify:core',
    ]);
}