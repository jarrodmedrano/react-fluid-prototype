module.exports = {
    core: {
        options: {
            files: [
                'temp/core/templates/<%= currentFile.level %>/<%= currentFile.name %>/example/data/*.json'
            ],
            schema: {
                main: 'core/templates/<%= currentFile.level %>/<%= currentFile.name %>/schema/<%= currentFile.name %>.json',
                refs: [
                    'temp/schema/references/refs/**/*.json'
                ]
            }
        }
    },
    changelogs: {
        options: {
            files: [
                'core/templates/**/changelog.json',
                '!core/templates/schema/changelog.json'
            ],
            schema: {
                main: 'core/templates/schema/changelog.json'
            }
        }
    }
};