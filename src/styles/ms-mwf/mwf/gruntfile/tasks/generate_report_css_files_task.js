/*
    This task generates static compiled files that are tracked in git. The
    purpose of these files is to help identify what the impact of our changes
    are and to help notify our partners when our tempaltes change.

    The task compiles component and module specific CSS files so that we can
    easily see what the compiled changes to our scss files are.
*/
module.exports = function(grunt) {
    grunt.registerTask('generate-report-css-files', 'Creates html files to be diffed by reporting tool', function (p) {
        if (p !== null && p !== undefined) {
            grunt.config.set('partner', p);
            grunt.task.run('generateReportStylesheets:' + p);
            grunt.task.run('sass:partnerReports');
            grunt.task.run('postcss:partnerReports');
        } else {
            grunt.task.run('generateReportStylesheets');
            grunt.task.run('sass:reports');
            grunt.task.run('postcss:reports');
        }
    });
}