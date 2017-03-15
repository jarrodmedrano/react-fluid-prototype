module.exports = function(grunt) {
    grunt.registerTask('staging', function() {

        // setting 'release' to false means, "don't minify the css files"
        grunt.option('release', false);

        // setting 'bless' to true means, "apply the bless step during SASS step"
        grunt.option('bless', true);

        // setting 'useFixedText' to true produces constant data from MWF Faker via a faker.seed(12345)
        grunt.option('useFixedText', true);
        
        var taskList = [
            'clean-dist-temp',

            // uhf
            'curl',
            'convert',

            // build mdl
            'mwf_faker:mdl',
            'assemble:release_mdl',
            'sass:mdl',
            'copy:mdl',
        
            // build modx
            'mwf_faker:staging',
            'assemble:site_staging',
            'sass:staging',
            'postcss:staging',
            'uglify:mwf',       // minify JS (codeExamples.js)
            'copy:staging',

            // build partners and core
            'build-all-partners',
            'build-core',
            'assemble:buildCoreIndex',

            // minify statics
            // we don't minify CSS for staging
            // CSS would be minifed for each partner during build-all-partners if option 'release' is defined

            // transform markdown
            'md2html:main',

            // copy statics
            'copy:scripts',     // temp/scripts to /dist/scripts
            'copy:release',
            'copy:release_partners',

            // clean up source files that were copied to release folder
            'clean:release',

            // final steps
            'zip:mwfScriptsPackage',
            'clean:temp',
            'notify:stagingBuilt'
        ];

        grunt.task.run(taskList);
    });
}