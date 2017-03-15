module.exports = {
    options: {
        preserveComments: 'some' // Preserve important comments
    },
    mwf: {
        files: [
            {
                'temp/local/scripts/codeExamples.min.js': ['partners/modx/scripts/codeExamples.js']
            }
        ]
    }
};