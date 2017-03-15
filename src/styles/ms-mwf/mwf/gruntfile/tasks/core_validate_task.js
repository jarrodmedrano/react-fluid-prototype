/**
 * Core Validate - This task spins up the core server, then runs all linters and validators. Use --force
 * to ensure all errors are shown. Note that when you use --force, the program will instead return
 * exit code 0
 */
module.exports = function(grunt) {
    grunt.registerTask('core-validate', 'Run validations for core environment', function () {
        var taskList = [
            'clean-dist-temp',
            'sasslint:core',
            'jshint:core',
            'exec:ts-lint',
            'require-example-files',
            'copy:schema_refs',
            'schema-validate-all',
            'core-build-html',
            'generate-report-files',
            'assertNoReportDiffs',
            'htmlhint:dist'
            // TODO - 10390346 - enable after fixing the time the linting taking.
            //, 'static-lint:coreValidate'
        ];

        // don't want devtoolbar to be a thing
        grunt.config.set('assemble.options.useDevToolbar', false);

        // run core specific linting
        // grunt.task.run('jsonlint'); TODO: investigate use, only hits one json file

        grunt.task.run(taskList);
    });
}