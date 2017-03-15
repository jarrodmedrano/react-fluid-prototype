module.exports = function (grunt) {

    var allFiles = null;
    var maxCount = 50;

    grunt.registerTask('build-sass', 'Creates html files to be diffed by reporting tool', function (partner) {
        var configFilePath = (partner !== 'core' ? 'partners/' + partner + '/config.json' : 'core/config.json'),
            config,
            taskList = [];

        config = grunt.file.readJSON(configFilePath);

        taskList.push('localization');
        taskList.push('sass:localize');

        // Minify ONLY if we are going to release
        if (grunt.option('release')) {
            taskList.push('cssmin:temp');
        }

        if (grunt.option('bless')) {
            // we need to bless only if we're building IE8 or IE9
            if (config.ie9 === true || config.ie8 === true) {
                taskList.push('bless-task:temp/css/');
            }
        }

        // The above need to complete fully before we get the list of files.
        // Therefore, we need to have a task to get the files and push the postcss tasks.
        var taskPostCss = 'push-tasks-for-postcss:';
        if (grunt.option('bless')) {
            // if we're generating ie8 or ie9 files via bless,
            // run the postcss:ie8/ie9 tasks as needed (based on config)
            // otherwise just "zero-out" to skip
            taskPostCss = taskPostCss + config.ie8 + '-' + config.ie9;
        }
        else {
            taskPostCss = taskPostCss + 'false-false';
        }
        taskList.push(taskPostCss);

        grunt.task.run(taskList);
    });

    function getAlteredPath(filename) {
        var fileSplit = filename.split('/');
        var name = fileSplit[fileSplit.length - 1];
        var subdir;

        if (filename.indexOf('ie8') >= 0) {
            subdir = 'ie8';
        } else if (filename.indexOf('ie9') >= 0) {
            subdir = 'ie9';
        } else {
            subdir = 'default';
        }

        var fileArray = fileSplit.slice(0, -1);
        fileArray.push(subdir, name);
        var fileRet = fileArray.join('/');
        return fileRet;
    }

    // All these registered tasks below should be considered private methods used by 'build-sass'.
    // None of the below registered tasks should be called directly.
    // They are registered to force synchronous processing of the files and to prevent clobbering and malfunction.
    grunt.registerTask('push-tasks-for-postcss', 'creates appropriate tasks for post-css operation', function (ieBrowsers) {
        allFiles = grunt.file.expand('temp/css/*.css');
        var completedFiles = 0,
            ieBrowsersArray = ieBrowsers.split('-'),
            ie8Config = ieBrowsersArray[0],
            ie9Config = ieBrowsersArray[1];

        var taskList = [];

        while (completedFiles < allFiles.length) {

            var countIE8 = 0;
            var countIE9 = 0;
            var countDefault = 0;
            var fileIndexStart = completedFiles;

            // loop through files until any count > maxCount
            // this will allow us to determine how many times to call our registered task to copy
            for (var ifile = completedFiles; ifile < allFiles.length; ifile++, completedFiles++) {
                var file = allFiles[ifile];
                if (file.indexOf('ie8') >= 0) {
                    if (++countIE8 >= maxCount) {
                        break;
                    }
                } else if (file.indexOf('ie9') >= 0) {
                    if (++countIE9 >= maxCount) {
                        break;
                    }
                } else if (++countDefault >= maxCount) {
                    break;
                }
            }

            taskList.push('copy-for-postcss:' + fileIndexStart + '-' + completedFiles);
            if (countIE8 > 0 && ie8Config === 'true') {
                taskList.push('postcss:ie8');
            }
            if (countIE9 > 0 && ie9Config === 'true') {
                taskList.push('postcss:ie9');
            }
            if (countDefault > 0) {
                taskList.push('postcss:defaultFiles');
            }

            // copy the files back to the root directory, out of the subdir
            taskList.push('copy:postcss');
            taskList.push('clean:tempCssSubdirs');
        }

        grunt.task.run(taskList);
    });

    grunt.registerTask('copy-for-postcss', 'Copies css files to appropriate directory for post-css operation', function (fileIndices) {
        var fileIndicesArray = fileIndices.split('-');
        var fileStart = parseInt(fileIndicesArray[0], 10);
        var fileEnd = parseInt(fileIndicesArray[1], 10);

        if (!allFiles) {
            console.log('Unexpected list of files');
            return;
        }

        // copy the files from the root directory to the appropriate sub-directory
        for (var ifile = fileStart; ifile < fileEnd; ifile++) {
            var file = allFiles[ifile];
            var newfile = getAlteredPath(file);
            grunt.file.copy(file, newfile);
        }
    });
}