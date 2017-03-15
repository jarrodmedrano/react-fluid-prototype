module.exports = function(grunt) {
    grunt.registerTask('generate-report-files', 'Create all reporting files', function (p) {
        if (p !== null && p !== undefined) {
            grunt.config.set('partner', p);
            grunt.option('reportsRoot', 'partners/' + p + '/templates/');
            grunt.option('componentSrcRoot', 'partners/' + p + '/templates/components');
            grunt.option('moduleSrcRoot', 'partners/' + p + '/templates/modules');
            grunt.option('cssSrcRoot', 'partners/' + p + '/templates/');
            grunt.task.run('generate-report-html-files:' + p);
            grunt.task.run('generate-report-css-files:' + p);
            grunt.task.run('generate-report-js-files:' + p);
            grunt.task.run('clean:partnerReports');
        } else {
            grunt.option('reportsRoot', 'core/templates/');
            grunt.option('componentSrcRoot', 'core/templates/components');
            grunt.option('moduleSrcRoot', 'core/templates/modules');
            grunt.option('cssSrcRoot', 'core/templates/');
            grunt.task.run('generate-report-html-files');
            grunt.task.run('generate-report-css-files');
            grunt.task.run('generate-report-js-files');
            grunt.task.run('clean:reports');
        }
    });
}