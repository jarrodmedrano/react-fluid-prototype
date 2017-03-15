/*
    This task generates static compiled files that are tracked in git. The
    purpose of these files is to help identify what the impact of our changes
    are and to help notify our partners when our tempaltes change.

    The generateReportTemplates task uses our modx code-example templates
    and data as the source for the component reporting files, while the files
    from /moduels/{name}/test/index.hbs are used for modules. The reason for this
    difference is that faker cannot be used in the data-source because it will
    assert changes to the template when there aren't actually changes. The task
    strips out everything execpt for handlebars partial calls and writes a new
    file with just the partial calls. If you compile tese files and changes are
    found, it means that changes were made that impacted these files, and you must
    commit them to your branch so that the report files don't fall out of sync
    with the source files.
*/
module.exports = function(grunt) {
    grunt.registerTask('generate-report-html-files', 'Creates html files to be diffed by reporting tool', function (p) {
        if (p !== null && p !== undefined) {
            grunt.config.set('partner', p);
            grunt.task.run('generateReportTemplates:' + p);
            grunt.task.run('mwf_faker:partner');
            grunt.task.run('mwf_faker:staging'); // Reports are generated from code-examples so we need the data from this process
            grunt.task.run('assemble:partnerReports');
            grunt.task.run('htmlmin:partnerReports');
            grunt.task.run('jsbeautifier:partnerReports'); // jsbeautifier can beautify HTML too...
        } else {
            grunt.task.run('generateReportTemplates');
            grunt.task.run('mwf_faker:core');
            grunt.task.run('mwf_faker:staging'); // Reports are generated from code-examples so we need the data from this process
            grunt.task.run('assemble:reports');
            grunt.task.run('htmlmin:coreReports');
            grunt.task.run('jsbeautifier:reports'); // jsbeautifier can beautify HTML too...
        }
    });
}