module.exports = function(grunt) {
    grunt.registerTask('build-core', function () {
        var configFilePath = "core/config.json",
            coreConfig,
            taskList = [];

        coreConfig = grunt.file.readJSON(configFilePath);

        // core can be built in conjunction with partner builds,
        // so null out the partner option for core
        // as its value affects some of the below tasks
        grunt.option('partner', null);

        taskList.push('clean-temp');
        taskList.push('mwf_faker:core');
        if (grunt.option('assemble') == 'uhf') {
            taskList.push('assemble:uhf');
        } else {
            taskList.push('assemble:core');
        }
        // TODO: Reenable when work has continued on Deliverable 8604192
        //taskList.push('assemble:fixtures');
        taskList.push('copy:vendor');
        taskList.push('build-sass:core');
        taskList.push('core-build-ts');
        taskList.push('build-scripts-core');
        taskList.push('copy:css');
        taskList.push('copy:scripts');
        taskList.push('copy:fonts');
        taskList.push('copy:images');
        taskList.push('copy:core');
        taskList.push('copy:fixturesCss');
        taskList.push('copy:fixturesFonts');
        taskList.push('copy:fixturesHtml');
        taskList.push('copy:devToolBar');
        taskList.push('htmlmin:dist');
        taskList.push('jshint:core');
        taskList.push('jshint:devToolBar');
        taskList.push('notify:coreBuilt');

        grunt.task.run(taskList);
    });
}