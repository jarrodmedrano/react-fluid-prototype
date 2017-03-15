module.exports = {
    dist: {
        options: {
            'tag-pair': true,
            'tagname-lowercase': true,
            'attr-no-duplication': true,
            'src-not-empty': true,
            'attr-unsafe-chars': true
        },
        src: ['./dist/core/templates/{components,modules}/*/*.html', './dist/partners/*/templates/{components,modules,pages}/*/*.html']
    }
};