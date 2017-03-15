module.exports = function(grunt) {
    grunt.registerTask('bless-task', function (root) {

        // Create the object for bless, for making < ie9 CSS files, split up due to the selector limitation of 4096 in IE < 9.
        // Note that we'd like to keep all the *-ie8.css filenames. 
        var makeCssBlessFilesObject = function () {

            var filesObject = {};

            function buildFileObject(abspath, rootdir, subdir, filename) {
                // files with 'ie8-orig.css' in them should be renamed to just 'ie8.css'
                // files with '.min.css' should still end with '.min.css'
                // all other files will have -ie9 added to the name before .css
                var outputName = (filename.indexOf('ie8') == -1
                    ? (filename.indexOf('min.css') == -1 ? rootdir + filename.replace('.css', '-ie9.css') : rootdir + filename.replace('.min.css', '-ie9.min.css'))
                    : rootdir + filename.replace('ie8-orig', 'ie8'));
                var inputName = rootdir + filename;
                filesObject[outputName] = inputName;
            }

            grunt.file.recurse(root, buildFileObject);

            return filesObject;
        };

        grunt.config.set('bless.split.files', makeCssBlessFilesObject());

        grunt.task.run('bless:split');
        grunt.task.run('del-ie8-orig-files');

    });

    // we need to register this as a Task so that this function will be executed synchronously
    grunt.registerTask('del-ie8-orig-files', function () {

        var files = grunt.config.get('bless.split.files');

        for (var file in files) {
            // if the file was an ie8-orig file, then delete it
            if (files[file].indexOf('ie8-orig') > -1)
                grunt.file.delete(files[file]);
        }
    });

}