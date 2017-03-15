module.exports = function(grunt) {
    grunt.registerTask('clean-dist-temp', [
        'force-on',
        'clean:dist',
        'clean:temp',
        'force-off'
    ]);
}