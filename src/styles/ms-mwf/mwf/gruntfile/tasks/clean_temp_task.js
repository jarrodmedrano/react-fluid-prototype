module.exports = function(grunt) {
    grunt.registerTask('clean-temp', [
        'force-on',
        'clean:temp',
        'force-off'
    ]);
}