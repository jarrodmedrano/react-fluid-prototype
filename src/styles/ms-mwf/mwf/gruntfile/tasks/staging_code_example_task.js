module.exports = function(grunt) {
    grunt.registerTask('create-staging-code-example', function (level, name) {
        var rootPath = 'partners/modx/chunks/code-examples/' + level + '/' + name + '/';
        grunt.file.write(rootPath + name + '-code-example.hbs');
        grunt.file.write(rootPath + 'data/' + name + '-code-example.json', '{}');
    });
}