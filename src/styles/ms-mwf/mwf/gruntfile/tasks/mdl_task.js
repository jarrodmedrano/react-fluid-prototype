// TODO: this grunt task ('mdl') is broken and should be deleted
module.exports = function (grunt) {
    grunt.registerTask('mdl', [
        'mwf_faker:mdl',
        'assemble:mdl',
        'copy:vendor',
        'build-sass:mdl',
        'build-scripts-core',
        'sass:mdl',
        'copy:css',
        'copy:scripts',
        'copy:fonts',
        'copy:mdl',
        'notify:mdlBuilt'
    ]);
}