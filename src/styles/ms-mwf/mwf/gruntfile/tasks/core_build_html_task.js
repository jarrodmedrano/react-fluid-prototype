module.exports = function(grunt) {
    grunt.registerTask('core-build-html', [
        'clean:html',
        'mwf_faker:core',
        'assemble:core',
        'notify:coreBuilt'
    ]);
}