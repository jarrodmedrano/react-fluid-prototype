module.exports = function(grunt) {
    grunt.registerTask('require-example-files', 'Checks for presence of example files for reports', function (p) {
        if (p !== null && p !== undefined && p !== 0) {
            grunt.task.run('assertExampleFiles:' + p);
        } else {
            grunt.task.run('assertExampleFiles');
        }
    });
}