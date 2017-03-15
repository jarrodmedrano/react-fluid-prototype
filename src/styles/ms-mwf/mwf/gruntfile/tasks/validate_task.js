/**
 * Validate - This task spins up the dev server, then runs all linters and validators. Use --force
 * to ensure all errors are shown. Note that when you use --force, the program will instead return
 * exit code 0
 */
module.exports = function(grunt) {
    grunt.registerTask('validate', 'Run validations in dev environment', function (p) {
        partner = grunt.option('partner');
        server = grunt.option('server');

        var coreOrPartner = partner || 'core';

        taskList = [
            'sasslint:all',
            'jshint',
            'jsonlint',
            'exec:ts-lint',
            'require-example-files',
            'copy:schema_refs',
            'schema-validate-all',
            'core-build-html',
            'build-sass:' + coreOrPartner,
            'copy:fixturesCss',
            'copy:fixturesFonts',
            // TODO: Reenable when work has continued on Deliverable 8604192
            // 'assemble:fixtures',
            'copy:fixturesHtml',
            'htmlhint:dist',
            // TODO - 10390346 - enable after fixing the time the linting taking.
            // 'static-lint:coreValidate',
            'static-lint:partnerValidateAll'
        ];

        // don't want devtoolbar to be a thing
        grunt.config.set('assemble.options.useDevToolbar', false);
        grunt.task.run(taskList);

        // keep at bottom to avoid sass linter errors with reporting
        if (partner !== null && partner !== undefined) {
            grunt.task.run('generate-report-files:' + partner);
            grunt.task.run('assertNoReportDiffs:' + partner);
        } else {
            grunt.task.run('generate-report-files');
            grunt.task.run('assertNoReportDiffs');
        }
    });
}