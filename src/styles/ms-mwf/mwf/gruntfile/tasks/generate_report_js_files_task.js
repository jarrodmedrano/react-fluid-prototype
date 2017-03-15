module.exports = function(grunt) {
    grunt.registerTask('generate-report-js-files', 'Copies js files to be diffed by reporting tool', function (p) {
        grunt.task.run('generateReportJavaScript');
    });
}