module.exports = function(grunt) {
    // -----------------------------------------------------------------------------
    // CDN tasks
    // -----------------------------------------------------------------------------
    /**
     * Optional for partner deployable scripts append: "--deployPartnerStatics=$(partnerId)" into VSTS in the
     * grunt oneui-cdn, arguments field.
     * This should only be used if we HAVE TO deploy a static to the long CDN path for a partner.
     */
    grunt.registerTask('oneui-cdn', function (option) {
        
        grunt.option('release', true);
        grunt.option('bless', true);
        
        grunt.task.run('clean');

        // build and copy partners and core
        grunt.task.run('build-all-partners');
        grunt.task.run('clean:temp');
        grunt.task.run('build-core');

        if (grunt.option('useLangLocales')) {
            grunt.task.run('css2langlocale');
        }
        grunt.task.run('copy:cdncss');

        // copy and minify javascript
        grunt.task.run('core-build-prod-ts');
        grunt.task.run('copy:cdnscripts');

        // copy fonts
        grunt.task.run('copy:cdnfonts');

        // copy manifests
        grunt.task.run('copy:cdnmanifests');
        if (grunt.option('deployPartnerStatics')) {
            grunt.task.run('copy:cdnpartnerstatics');
        }
    });
}