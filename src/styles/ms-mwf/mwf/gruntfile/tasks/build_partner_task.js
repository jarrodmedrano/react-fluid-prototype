module.exports = function(grunt) {
    grunt.registerTask('build-partner', function (p) {
        var taskList = [];

        if (p === null) {
            grunt.warn('Partner option must be specified in dev-server task.');
        } else {
            // use valued passed in when task is called from watch task
            partner = p.toLowerCase();
            grunt.config.set('partner', p);
            grunt.option('partner', partner);
        }

        // clean /temp to allow multiple partner builds without causing memory issues
        taskList.push('clean-temp');

        // get UHF information from the UHF service. note possible parameter like: "--uhf=uhf-int"
        if (p && p.toLowerCase() == 'uhf') {
            taskList.push('curl');
            taskList.push('convert');
        }

        // push oneplayer build task if current partner is oneplayer: --partner=oneplayer
        if (p && p.toLowerCase() === 'oneplayer') {
            if (grunt.option('release')) {
                taskList.push('exec:oneplayer-bundle-release');
            } else {
                taskList.push('exec:oneplayer-bundle-debug');
            }
        }

        // do general assembly
        taskList.push('mwf_faker:partner');
        taskList.push('assemble:partner');

        // build-sass will also do 'cssmin:temp' if we are in a release.
        taskList.push('build-sass:' + p);
        taskList.push('copy:partner');
        taskList.push('copy:css');

        grunt.task.run(taskList);
    });
}