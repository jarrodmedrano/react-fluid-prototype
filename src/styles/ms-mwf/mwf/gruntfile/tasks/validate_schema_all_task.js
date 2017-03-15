/**
 * Validate All Schemas
 */
module.exports = function (grunt) {
    grunt.registerTask('schema-validate-all', 'Run schema validation', function (p) {
        var schemaTaskList = [], 
        	componentBase = 'temp/schema/references/refs/components',
            moduleBase = 'temp/schema/references/refs/modules',
            name_regex = /[^\/]*/;

        // push all schemas into list for running sequentially
        grunt.file.expand({ cwd: componentBase }, '**/*.json').forEach(function (item) {
            var name = item.match(name_regex);
            schemaTaskList.push('schema-validate:' + name + ':component:true');
        });
        grunt.file.expand({ cwd: moduleBase }, '**/*.json').forEach(function (item) {
            var name = item.match(name_regex);
            schemaTaskList.push('schema-validate:' + name + ':module:true');
        });

        schemaTaskList.push('json_schema_validation:changelogs');
        grunt.task.run(schemaTaskList);
    });
}