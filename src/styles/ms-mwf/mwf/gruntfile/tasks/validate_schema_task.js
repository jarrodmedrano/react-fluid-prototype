/**
 * Validate Schemas
 */
module.exports = function (grunt) {
    grunt.registerTask('schema-validate', 'Run schema validation', function (item, level, all) {
        var taskList; // use 'copy:schema_refs' for individual checking

        if (all) {
            taskList = [];
        } else {
            taskList = ['copy:schema_refs'];
        }

        setupJSONValidation(level, item);
        taskList.push('json_schema_validation:core');
        grunt.task.run(taskList);

        /*
        * Setup all config options to run validation for example data
        */
        function setupJSONValidation(level, item) {
            var name = item,
                srcpathJSON,
                tempPath,
                destpathJSON,
                srcpathHbs,
                hasData = false;

            if (level === 'component') {
                // check to see if there is a schema
                hasData = grunt.file.exists('core/templates/components/' + name + '/example/data/c-' + name + '-code-example.json');

                // get name of component
                // move files to temp
                srcpathJSON = 'core/templates/components/' + name + '/example/data/c-' + name + '-code-example.json';
                tempPath = 'temp/core/templates/components/' + name + '/example/data/';
                destpathJSON = tempPath + 'c-' + name + '-code-example.json';
                srcpathHbs = 'core/templates/components/' + name + '/example/c-' + name + '-code-example.hbs';

                grunt.config.set('currentFile.shortLevel', 'c-');
                grunt.config.set('currentFile.level', 'components');
            } else if (level === 'module') {
                // check to see if there is a schema
                hasData = grunt.file.exists('core/templates/modules/' + name + '/example/data/m-' + name + '-code-example.json');

                // get name of module
                // move files to temp
                srcpathJSON = 'core/templates/modules/' + name + '/example/data/m-' + name + '-code-example.json';
                tempPath = 'temp/core/templates/modules/' + name + '/example/data/';
                destpathJSON = tempPath + 'm-' + name + '-code-example.json';
                srcpathHbs = 'core/templates/modules/' + name + '/example/m-' + name + '-code-example.hbs';

                grunt.config.set('currentFile.shortLevel', 'm-');
                grunt.config.set('currentFile.level', 'modules');
            }

            if (hasData) {

                // create file in temp/
                grunt.file.copy(srcpathJSON, destpathJSON);

                // read example hbs file, strip out names of properties to isolate testable json
                var exampleJSON = '';
                var exampleHbs = '';
                var exampleArray = [];
                var regex_prop = /\.(.*)}}/g;
                exampleJSON = grunt.file.readJSON(destpathJSON);
                exampleHbs = grunt.file.read(srcpathHbs);

                var exampleMatches = exampleHbs.match(regex_prop);
                exampleMatches = cleanHbsMatches(exampleMatches);

                // setup currentFile with name, extension, level (component or module)
                grunt.config.set('currentFile.name', name);

                for (var i = 0; i < exampleMatches.length; i++) {
                    var snippet,
                        templateName;

                    // check template-name for this items template, if not skip
                    templateName = grunt.config.get('currentFile.level') === 'components' ? name + '-template' : name + '-module';

                    if (templateName === exampleJSON[exampleMatches[i]]["template-name"]) {
                        var fileName = level === 'component' ? 'c-' + exampleMatches[i] + '-code-example.json' : 'm-' + exampleMatches[i] + '-code-example.json';

                        snippet = exampleJSON[exampleMatches[i]].data;

                        // write snippet to file
                        grunt.file.write(tempPath + fileName, JSON.stringify(snippet));

                        // set file name
                        grunt.config.set('currentFile.file', fileName);
                    }
                }

                // remove original file -- file is unnecessary, only use specific json to validate against schemas
                grunt.file.delete(destpathJSON);
            } else {
                grunt.log.ok('There is no data to validate against for ' + name + '.');
            }
        }

        /*
        * Clean regex matches
        * removes '.' in beginning, }} at end (check for extra space)
        */
        function cleanHbsMatches(matches) {
            // strip out first '.'
            for (var i = 0; i < matches.length; i++) {
                matches[i] = matches[i].slice(1, matches[i].length - 2);
                if (matches[i].slice(matches[i].length - 1, matches[i].length) === ' ') {
                    matches[i] = matches[i].slice(0, matches[i].length - 1);
                }
            }
            return matches;
        }

    });
}