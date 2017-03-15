module.exports = function (grunt) {
    grunt.registerTask('generate-changelogs', 'Generate individual and aggregate changelogs.', function (v) {
        if (v === null || v === undefined || v === 'update') {
            grunt.fail.fatal('Specify a version, eg. "grunt generate-changelogs:v1.8.0"');
        } else {
            grunt.task.run('generateChangelogs:' + v);
        }
    })
}