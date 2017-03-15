module.exports = function(grunt) {
    var description = 'Run a development server for the specified partner. Specify the partner as a command line parameter (e.g. --partner=amc)';
    grunt.registerTask('dev-server', description, function () {
        if (!grunt.option('partner')) {
            // if grunt.option('partner') is false-y, (e.g. undefined, null, '', 0) warn the user that a required parameter is missing
            grunt.warn('Partner parameter must be specified, ex: dev-server --partner=amc, dev-server --partner=msn, dev-server --partner=store, dev-server --partner=example, dev-server --partner=search, dev-server --partner=signature, etc...');
        }

        grunt.task.run(
            'clean-dist-temp',
            'check-available-port',
            'build-partner:' + grunt.option('partner'),
            'clean-temp',
            'build-core',
            'connect:default',
            'notify:partnerStarted',
            'focus:partner');
    });
}