/**
 * Core Validate - This task spins up the core server, then runs all linters and validators. Use --force
 * to ensure all errors are shown. Note that when you use --force, the program will instead return
 * exit code 0
 */
module.exports = function(grunt) {
    grunt.registerTask('partner-validate', 'Run validations for partner environment', function (p) {
        if (grunt.option('partner') !== null) {
            // use stored value when called from watch task
            partner = grunt.option('partner');
        } else if (p === null) {
            grunt.warn('Partner parameter must be specified, ex: partner-validate --partner=example');
        } else {
            // use valued passed in when task is called from command line
            partner = p;

            grunt.option('partner', partner);
        }

        // don't want devtoolbar to be a thing
        grunt.config.set('assemble.options.useDevToolbar', false);
        grunt.task.run('clean-dist-temp');

        // set partner to pass into grunt task
        grunt.config.set('partner', partner);

        grunt.task.run('sasslint:all');
        grunt.task.run('htmlhint:dist');
        grunt.task.run('jshint:partner');
        grunt.task.run('exec:ts-lint');
        grunt.task.run('static-lint:coreValidate');
        grunt.task.run('static-lint:partnerValidate');
        // grunt.task.run('jsonlint'); TODO: investigate use, only hits one json file
        grunt.task.run('require-example-files:' + partner);

        grunt.task.run('generate-report-files:' + partner);
        grunt.task.run('assertNoReportDiffs:' + partner);

    });
}